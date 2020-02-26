let defaults = require('./config.defaults')

let localConfig = {}

try {
	localConfig = require('./config')
} catch(e) {
	console.warn('Could not load local config "server/config/config.json"', e.message)
}

module.exports = Object.assign({}, defaults, localConfig)
