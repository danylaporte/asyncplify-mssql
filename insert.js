var Asyncplify = require('asyncplify');

module.exports = function (options) {
	return function (items) {
		return items
			.flatMap(function (item) {
				var sql1 = 'INSERT INTO [' + options.table + '] (';
				var sql2 = ') VALUES (';
				var params = [];
				
				for (var k in item) {
					if (item.hasOwnProperty(k)) {
						var p = 'p' + params.length;
						var comma = params.length ? ',' : ''; 
						
						sql1 += comma + k;
						sql2 += comma + '@' + p;
						
						params.push({ name: p, value: item[k]});
					}
				}
				
				return options
					.connection
					.query({ sql: sql1 + sql2 + ')', parameters: params })
					.defaultIfEmpty(item);	
			});
	};
};