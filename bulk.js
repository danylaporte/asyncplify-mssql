var sql = require('./index');

function createTable(options) {
    var columns = options.columns;
    var table = new sql.Table(options.table);
    table.create = options.create;

    for (var i = 0; i < columns.length; i++) {
        var col = columns[i];
        table.add(col.name, col.type, { nullable: col.nullable });
    }
    
    return table;
}

module.exports = function (options) {
    return function (items) {
        return items
            .toArray(5000)
            .flapMap({
                mapper: function (items) {
                    var table = createTable(options);
                    var columns = options.columns;
        
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        var array = [];
                        
                        for (var j = 0; j < columns.length; j++) {
                            array.push(item[columns[j].name]);
                        }
                        
                        table.rows.add(array);
                    }
                    
                    return options.request(table);
                },
                maxConcurrency: 1
            });
    };
};