const easymidi = require('easymidi');
const config = require('./config')

const EventEmitter = require('events');
class MidiEmitter extends EventEmitter {}

let input = new easymidi.Input(config.MIDI_INPUT_NAME, true);
let output = new easymidi.Output(config.MIDI_OUTPUT_NAME, true);

let midi = module.exports

midi.midiEmitter = new MidiEmitter()

midi.send = function(cc) {
	output.send('cc', {
		controller: cc,
		value: 80,
		channel: config.MIDI_OUTPUT_CHANNEL
	});

	// output.send('noteon', {
	// 	note,
	// 	velocity: 127,
	// 	channel: config.MIDI_OUTPUT_CHANNEL
	// });

	// setTimeout(() => {
	// 	output.send('noteoff', {
	// 		note,
	// 		velocity: 127,
	// 		channel: config.MIDI_OUTPUT_CHANNEL
	// 	});
	// }, 1000)
}

input.on('noteon', function (msg) {
	// do something with msg
	console.log('noteon', msg)

	midi.midiEmitter.emit('note')
});
