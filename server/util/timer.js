
module.exports.startTimer = function(seconds, scene, callback) {
	const update = () => {
		if (scene.running) {
			timer.secondsLeft--
			if (timer.secondsLeft <= 0) {
				clearInterval(interval)
				callback()
			}
		}
	}
	let interval = setInterval(update, 1000)

	let timer = {
		stop() {
			clearInterval(interval)
		},
		secondsLeft: seconds
	}

	return timer
}
