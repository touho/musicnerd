const BaseScene = require('./BaseScene')

module.exports = class TestButton extends BaseScene {
	clicks = 0
	paused = true

	getInitialPrivateData() {
		return {
			clicks: 0
		}
	}

	handleAction(name, data, privateData) {
		this.callHandler(name, data, {
			click: () => {
				this.clicks++
				privateData.clicks++
			}
		})
	}

	getPublicData() {
		return {
			clicks: this.clicks
		}
	}
}
