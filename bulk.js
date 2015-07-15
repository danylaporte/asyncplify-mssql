var Asyncplify = require('asyncplify');
var debug = require('debug')('asyncplify-mssql:bulk');
var sql = require('mssql');
var Request = sql.Request;
var SqlTable = sql.Table;
var types;

function createColumnArray(columns) {
    if (!types) types = createLowercaseProps(sql.TYPES);

    var array = [];
    var regex = /^\s*([a-z0-9]+)\s*(?:\(\s*([0-9]+)?(?:,\s*)?([0-9]+)?\s*\))?\s*(null|not\snull)?\s*$/gi;

    for (var k in columns) {
        if (columns.hasOwnProperty(k)) {
            regex.lastIndex = 0;

            var info = regex.exec(columns[k]);
            if (!info) throw new Error("Cannot parse sql type expression '" + columns[k] + "' for column '" + k + "'.");
            var type = types[info[1].toLowerCase()];
            if (!type) throw new Error("SQL type '" + info[1] + "' not found for column '" + k + "'.");

            array.push({
                name: k,
                type: types[info[1].toLowerCase()](info[2], info[3]),
                nullable: (info[4] || '').toLowerCase() !== 'not null'
            });
        }
    }
    return array;
}

function createLowercaseProps(types) {
    var o = {};
    for (var k in types) {
        if (types.hasOwnProperty(k))
            o[k.toLowerCase()] = types[k];
    }
    return o;
}

module.exports = function (options) {
    var columns;

    return function (items) {
        return items
            .toArray(5000)
            .flatMap({
                mapper: function (items) {
                    debug('inserting %d item(s)', items.length);
                    var i;
                    var tableOptions = options.tableOptions;
                    var table = new SqlTable(tableOptions.table);

                    table.create = tableOptions.create;

                    if (!columns) columns = createColumnArray(tableOptions.columns);

                    for (i = 0; i < columns.length; i++) {
                        var col = columns[i];
                        table.columns.add(col.name, col.type, { nullable: col.nullable });
                    }

                    for (i = 0; i < items.length; i++) {
                        var item = items[i];
                        var array = [];

                        for (var j = 0; j < columns.length; j++)
                            array.push(item[columns[j].name]);

                        table.rows.push(array);
                    }

                    return new Asyncplify(Bulk, { connection: options.connection, table: table });
                },
                maxConcurrency: 1
            });
    };
};

function Bulk(options, sink) {
    this.sink = sink;
    this.sink.source = this;
    this.request = new Request(options.connection);
    var self = this;

    this.request.bulk(options.table, function bulkResult(err, count) {
        if (self.sink) {
            if (err)
                debug('error inserting items', err);
            else
                debug('insert %d item(s)', count);

            if (!err) self.sink.emit(count);
            if (self.sink) self.sink.end(err);
            self.sink = null;
        }
    });
}

Bulk.prototype.setState = function (state) {
    if (state === Asyncplify.states.CLOSED) {
        this.sink = null;
        if (this.request) this.request.cancel();
        this.request = null;
    }
};