var assert = require('assert')
var dbg = require('debug')('cnip:load')
var download_data = require('../internal/download_data')
var parse_data = require('../internal/parse_data')
var convert_to_mask_list = require('../internal/convert_to_mask_list')

module.exports = function() {
	return new Promise((resolve, reject) => {
		dbg('download data...')
		download_data()
			.then(function(data) {
				dbg(data.length + ' bytes of data downloaded')
				dbg('parse data...')
				parse_data(data)
					.then(function(parsed_data) {
						dbg('filter all cn ipv4 records...')
						var cn_ipv4_records = parsed_data.records.filter(item => item.cc === 'CN' && item.type === 'ipv4')
						dbg('ok')
						resolve(cn_ipv4_records)						
					})
					.catch(function(err) {
						dbg(err.message)
						reject(err)
					})
			}).catch(function(err) {
				dbg(err.message)
				reject(err)
			})
	})
}
