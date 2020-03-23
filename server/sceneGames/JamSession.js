const BaseScene = require('./BaseScene')
const midi = require('../midi')
const _ = require('lodash')
const { startTimer } = require('../util/timer')

let instruments = [
	{ name: 'Drums', notes: 5 },
	{ name: 'Bass', notes: 5 },
	{ name: 'Percussion', notes: 5 },
	{ name: 'Synth chords', notes: 5 },
	{ name: 'Church bell', notes: 5 },
	{ name: 'Vocals', notes: 6 },
	{ name: 'UFO FX', notes: 5 },
	{ name: 'Ambient', notes: 5 }
]

let reservationSeconds = 20
let jamLength = 60 * 3

module.exports = class TestButton extends BaseScene {
	init() {
		// [{ connection, timer }]
		this.reservations = instruments.map(i => [])
		this.jamEnding = false
		this.startTimer(jamLength - reservationSeconds, () => {
			this.jamEnding = true

			this.startTimer(reservationSeconds, () => {
				this.setState('results')
			})
		})
	}

	getInitialPrivateData() {
		return {
			instrumentIndex: -1,
			isPlaying: false,
			queueSlot: -1
		}
	}

	removeConnectionReservations(connection) {
		for (let [i, res] of this.reservations.entries()) {
			_.remove(res, item => {
				if (item.connection === connection) {
					if (item.timer)
						item.timer.finnish()

					item.connection.privateData.isPlaying = false

					return true
				}
				return false
			})
			this.startPlaying(i)
		}
	}

	updateQueueIndexes() {
		for (let instrRes of this.reservations) {
			for (let [i, res] of instrRes.entries()) {
				res.connection.privateData.queueSlot = i
			}
		}
	}

	// The reservation must already exist
	// It's okay to call multiple times. This function just ignores then
	startPlaying(instrumentIndex) {
		let instrumentReservations = this.reservations[instrumentIndex]

		if (instrumentReservations.length === 0) return

		let reservation = instrumentReservations[0]

		if (reservation.connection.privateData.isPlaying) return

		reservation.timer = startTimer(reservationSeconds, this, () => {
			let reservation = instrumentReservations.shift()
			reservation.connection.privateData.isPlaying = false
			reservation.connection.privateData.instrumentIndex = -1
			reservation.connection.privateData.queueSlot = -1

			if (instrumentReservations.length > 0) {
				this.startPlaying(instrumentIndex)
			}

			this.updateQueueIndexes()
		})
		reservation.connection.privateData.isPlaying = true

		reservation.connection.sendData()
	}

	handleAction(name, data, privateData, connection) {
		this.callHandler(name, data, {
			reserve: (instrumentIndex) => {
				if (this.jamEnding) return
				this.removeConnectionReservations(connection)

				let instrumentReservations = this.reservations[instrumentIndex]

				instrumentReservations.push({
					connection
				})

				privateData.instrumentIndex = instrumentIndex

				this.startPlaying(instrumentIndex)

				this.updateQueueIndexes()
			},
			playNote: (note) => {
				if (privateData.isPlaying) {
					let idx = privateData.instrumentIndex
					let maxNote = instruments[idx].notes - 1
					midi.send(10 + idx * 10 + _.clamp(note, 0, maxNote))
				}
			}
		})
	}

	getPublicData() {
		return {
			instruments,
			reservations: this.reservations.map(instr => instr.map(r => ({
				name: r.connection.name,
				secondsLeft: r.timer ? r.timer.getPreciseSecondsLeft() : reservationSeconds,
			}))),
			reservationSeconds,
			jamEnding: this.jamEnding,
			jamTime: this.timer.secondsLeft
		}
	}

	connectionLeft(connection) {
		this.removeConnectionReservations(connection)
	}
}
