const BaseScene = require('./BaseScene')
const midi = require('../midi')
const _ = require('lodash')

const { connections } = require('../connection')

module.exports = class Tapper extends BaseScene {
    onNote = null

    init() {
        this.connections = new Set()

        this.onNote = note => {
            let connection = _.sample(Array.from(this.connections))
            if (!connection) return

            console.log('sending', note)

            // connection.socket.emit('a', { note })

            connection.privateData.note = note
            connection.sendData()
            connection.privateData.note = 0
        }

        midi.midiEmitter.on('note', this.onNote)
    }

    destroy() {
        super.destroy()
        midi.midiEmitter.off('note', this.onNote)
    }

    getInitialPrivateData() {
        return {
            joined: false
        }
    }

    handleAction(name, data, privateData, connection) {
        this.callHandler(name, data, {
            join: () => {
                privateData.joined = true
                this.connections.add(connection)
            }
        })
    }

    connectionLeft(connection) {
        this.connections.delete(connection)
    }

    getPublicData() {
        return {
            joinedCount: this.connections.size
        }
    }
}
