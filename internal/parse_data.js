var assert = require('assert')

module.exports = function(data) {
	return new Promise((resolve, reject) => {
		var lines = data.split('\n')
						.map(line => line.trim())
						.filter(line => /^#/.test(line) === false) // no comment line
						.filter(line => line.length > 0) // no empty line

		assert(lines.length >= 2)
		var header = parse_header(lines[0])
		var records = lines.slice(1).map(parse_record)
		resolve({
			header: header,
			summary: records.filter(item => item.hasOwnProperty('summary')),
			records: records.filter(item => !item.hasOwnProperty('summary'))
		})
	})
}

function parse_header(line) {
	var parts = line.split('|')
	assert(parts[0] === '2') // version 2
	assert(parts.length === 7)
	return {
		version: parts[0],
		registry: parts[1],
		serial: parts[2],
		records: parts[3],
		startdate: parts[4],
		enddate: parts[5],
		UTCoffset: parts[6],
	}
}

function parse_record(line) {
	var parts = line.split('|')

	// summary line or record?
	if (parts[1] === '*') {
		// summary line
		assert(parts.length === 6)
		return {
			registry: parts[0],
			// parts[1] is '*'
			type: parts[2],
			// parts[3] is '*'
			count: parts[4],
			summary: parts[5]
		}
	}
	else {
		// record
		assert(parts.length >= 7)
		return {
			registry: parts[0],
			cc: parts[1],
			type: parts[2],
			start: parts[3],
			value: parts[4],
			date: parts[5],
			status: parts[6],
		}
	}

}
