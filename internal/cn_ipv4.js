var assert = require('assert')

module.exports = function(parsed_data) {
	return parsed_data
				.records
				.filter(item => item.cc === 'CN' && item.type === 'ipv4')
				.map((item) => {
					return {
						
					}
				})
}