const BaseScene = require('./BaseScene')
const midi = require('../midi')
const _ = require('lodash')

const { connections } = require('../connection')

module.exports = class Tapper extends BaseScene {
    secondsLeft = 0
    init() {
        this.secondsLeft = 20

        const handler = () => {
            if (this.running) {
                if (this.secondsLeft <= 0) {

                } else {
                    this.secondsLeft--
                }
            }
            this.timeout = setTimeout(handler, 1000)
        }

        this.timeout = setTimeout(handler, 1000)
    }

    destroy() {
        clearTimeout(this.timeout)
    }

    getInitialPrivateData() {
        return {
            taps: 0,
        }
    }

    handleAction(name, data, privateData) {
        this.callHandler(name, data, {
            tap: () => {
                privateData.taps++
            }
        })
    }

    getPublicData() {
        let leaderTaps = _.maxBy(connections, conn => conn.privateData.taps).privateData.taps || 0
        return {
            leaderTaps,
            activeUsers: connections.length,
	        secondsLeft: this.secondsLeft
        }
    }
}
