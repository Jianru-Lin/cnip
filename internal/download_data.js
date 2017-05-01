var assert = require('assert')
var fs = require('fs')
var path = require('path')
var request = require('request')
var data_url = 'http://ftp.apnic.net/apnic/stats/apnic/delegated-apnic-latest'

module.exports = function() {
	return new Promise((resolve, reject) => {
		if (cache_available()) {
			var data = load_cache()
			resolve(data)
			return
		}

		request(data_url, function(err, res, body) {
			if (err) {
				reject(err)
				return
			}
			else if (res.statusCode !== 200) {
				reject(new Error('response code is ' + res.statusCode + ', not 200'))
				return
			}

			assert(typeof body === 'string')
			save_cache(body)
			resolve(body)
		})
	})
}

function cache_available() {
	if (fs.existsSync(cache_filename())) {
		return true
	}
}

function load_cache() {
	return fs.readFileSync(cache_filename(), 'utf8')
}

function save_cache(data) {
	fs.writeFileSync(cache_filename(), data)
}

function cache_filename() {
	return path.resolve(__dirname, '../data.txt')
}