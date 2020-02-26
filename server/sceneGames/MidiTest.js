const BaseScene = require('./BaseScene')
const midi = require('../midi')

module.exports = class TestButton extends BaseScene {
	scene = 0

	getInitialPrivateData() {
		return {
		}
	}

	handleAction(name, data, privateData) {
		this.callHandler(name, data, {
			startScene: (sceneNumber) => {
				this.scene = sceneNumber
				midi.send(60 + sceneNumber)
			}
		})
	}

	getPublicData() {
		return {
			scene: this.scene
		}
	}
}
