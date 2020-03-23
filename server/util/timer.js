
module.exports.startTimer = function(seconds, scene, callback) {
	const update = () => {
		if (scene.running) {
			timer.secondsLeft--
			timer.changeTimestamp = Date.now()
			if (timer.secondsLeft <= 0) {
				timer.finnish()
			}
		} else if (scene.state === 'over') {
			console.log('over. stop timer')
			timer.stop()
		}
	}
	let interval = setInterval(update, 1000)

	let timer = {
		changeTimestamp: Date.now(),
		stop() {
			timer.alive = false
			clearInterval(interval)
		},
		finnish() {
			if (!timer.alive) return

			timer.alive = false
			clearInterval(interval)
			callback()
		},
		secondsLeft: seconds,
		alive: true,
		getPreciseSecondsLeft() {
			return timer.secondsLeft - (Date.now() - timer.changeTimestamp) / 1000
		}
	}

	return timer
}
