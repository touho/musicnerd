const BaseScene = require('./BaseScene')
const midi = require('../midi')
const _ = require('lodash')

const { connections } = require('../connection')

module.exports = class MuteVoting extends BaseScene {
    instruments = []
    votes = {}
    times = []
    init(instruments, times) {
        this.instruments = instruments
        this.votes = _.chain(instruments)
            .keyBy()
            .mapValues(p => 0)
            .value()

        this.times = times

        const handler = () => {
            let mutedInstrument = _.maxBy(
                Object.keys(this.votes),
                key => this.votes[key]
            )
            this.mute(mutedInstrument)

            if (this.times.length > 0) {
                this.startTimer(this.times.shift(), handler)
            } else {
                // No new timeouts
                return
            }
        }

        this.startTimer(this.times.shift(), handler)
    }

    mute(instrument) {
        delete this.votes[instrument]

	    for (let vote in this.votes) {
	    	this.votes[vote] = 0
	    }

        let index = this.instruments.indexOf(instrument)
	    midi.send(index)

        if (Object.keys(this.votes).length === 1) {
            setTimeout(() => this.setState('results'), 2000)
        }
    }

    getInitialPrivateData() {
        return {
            votedFor: null,
        }
    }

    connectionLeft(connection) {
        if (connection.privateData.votedFor && this.votes[connection.privateData.votedFor]) {
            this.votes[connection.privateData.votedFor]--
        }
    }

    handleAction(name, data, privateData) {
        if (Object.keys(this.votes).length <= 1) return

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
	        secondsLeft: this.timer ? this.timer.secondsLeft : 0,
            instruments: this.instruments
        }
    }
}
