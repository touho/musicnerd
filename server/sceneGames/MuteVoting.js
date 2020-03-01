const BaseScene = require('./BaseScene')
const midi = require('../midi')
const _ = require('lodash')

const { connections } = require('../connection')

module.exports = class MuteVoting extends BaseScene {
    instruments = []
    votes = {}
    secondsLeft = 0
    times = []
    init(instruments, times) {
        this.instruments = instruments
        this.votes = _.chain(instruments)
            .keyBy()
            .mapValues(p => 0)
            .value()

        this.times = times
        this.secondsLeft = this.times.shift()

        const handler = () => {
            if (!this.paused) {
                if (this.secondsLeft <= 0) {

                    let mutedInstrument = _.maxBy(
                        Object.keys(this.votes),
                        key => this.votes[key]
                    )
                    this.mute(mutedInstrument)

	                if (this.times.length > 0) {
		                this.secondsLeft = this.times.shift()
	                } else {
		                // No new timeouts
		                return
	                }
                } else {
                    this.secondsLeft--
                }
            }
            this.timeout = setTimeout(handler, 1000)
        }

        this.timeout = setTimeout(handler, 1000)
    }

    mute(instrument) {
        delete this.votes[instrument]

	    for (let vote in this.votes) {
	    	this.votes[vote] = 0
	    }

        let index = this.instruments.indexOf(instrument)
	    midi.send(index)
    }

    destroy() {
        clearTimeout(this.timeout)
    }

    getInitialPrivateData() {
        return {
            votedFor: null,
        }
    }

    handleAction(name, data, privateData) {
        this.callHandler(name, data, {
            vote: instrument => {
                if (privateData.votedFor && this.votes[privateData.votedFor]) {
                    this.votes[privateData.votedFor]--
                }
                privateData.votedFor = instrument
                this.votes[privateData.votedFor]++
            },
        })
    }

    getPublicData() {
        return {
            votes: this.votes,
            activeUsers: connections.length,
	        secondsLeft: this.secondsLeft
        }
    }
}
