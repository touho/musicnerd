const BaseScene = require('./BaseScene')
const midi = require('../midi')
const _ = require('lodash')

const { connections } = require('../connection')

let tappingTime = 10
let tapResultTime = 5
let bossingTime = 30

let ccStop = 9
let ccRunner = 10
let songs = [
    { name: 'Sandstorm', cc: ccRunner++ },
    { name: 'Smells Like Teen Spirit', cc: ccRunner++ },
    { name: 'Bohemian Rhapsody', cc: ccRunner++ },
    { name: 'Let Me Entertain You', cc: ccRunner++ }
]

module.exports = class Tapper extends BaseScene {
    secondsLeft = 0

    status = 'tap' // 'tap' | 'tapResults' | 'boss'

    boss = null

    bossControlIndex = 0

    bossControls = []

    currentlyPlayingControlIndex = null

    bossNames = []

    init(bossControls = [songs, songs, songs]) {
        this.bossControls = bossControls
        this.startTapping()
    }

    startTapping() {
        this.status = 'tap'
        this.startTimer(tappingTime, () => {
            this.startTapResults()
        })
    }

    startTapResults() {
        this.status = 'tapResults'

        this.tapResults = _.chain(connections)
            .map(conn => ({
                name: conn.name,
                taps: conn.privateData.taps,
                connection: conn,
            }))
            .orderBy('taps', 'desc')
            .value()

        for (let i = 0; i < this.tapResults.length; i++) {
            this.tapResults[i].connection.privateData.rank = i + 1
            delete this.tapResults[i].connection
        }

        this.startTimer(tapResultTime, () => {
            this.boss = _.maxBy(connections, c => c.privateData.taps)
            this.boss.privateData.isBoss = true
            this.bossNames.push(this.boss.name)
            this.startBossing()

            for (let conn of connections) {
                conn.privateData.taps = 0
            }
        })
    }

    startBossing() {
        this.status = 'boss'
        this.currentlyPlayingControlIndex = null
        this.startTimer(bossingTime, () => {
            midi.send(ccStop)
            this.bossControlIndex++
            if (this.bossControlIndex < this.bossControls.length) {
                for (let conn of connections) {
                    delete conn.privateData.isBoss
                }
                this.startTapping()
                this.setState('countdown')
            } else {
                this.setState('results')
            }
        })
    }

    getInitialPrivateData() {
        return {
            taps: 0,
        }
    }

    handleAction(name, data, privateData) {
        this.callHandler(name, data, {
            tap: () => {
                if (this.status === 'tap') {
                    privateData.taps++
                }
            },
            bossControl: index => {
                if (this.status === 'boss' && privateData.isBoss) {
                    let cc = this.bossControls[this.bossControlIndex][index].cc
                    midi.send(cc)
                    this.currentlyPlayingControlIndex = index
                }
            },
        })
    }

    getPublicData() {
        let leaderTaps =
            _.maxBy(connections, conn => conn.privateData.taps).privateData
                .taps || 0
        return {
            leaderTaps,
            activeUsers: connections.length,
            secondsLeft: this.timer ? this.timer.secondsLeft : 0,
            status: this.status,
            bossControls: this.bossControlIndex < this.bossControls.length && this.bossControls[this.bossControlIndex].map(control => control.name),
            bossName: this.boss && this.boss.name,
            tapResults: this.tapResults,
            currentlyPlayingControlIndex: this.currentlyPlayingControlIndex,
            bossNames: this.bossNames,
        }
    }
}
