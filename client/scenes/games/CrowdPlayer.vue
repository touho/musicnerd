<template>
    <SceneCommon
        :publicData="publicData"
        :instructions="instructions"
        title="Crowd Player"
    >
        <div class="Tapper Main">

            <div v-if="privateData.joined">
                <h2 class="coolText">Music Nerd will now play your device.</h2>
                <h2 class="coolText">♫</h2>
                <small>Total {{publicData.joinedCount}} devices.</small>
            </div>
            <div v-else>
                Click JOIN to play the initial sound.
                <div></div>
                <button @click="join">JOIN</button>
            </div>

        </div>
        <div class="Results">
            Thank you for being part of an instrument.
        </div>
    </SceneCommon>
</template>

<script>

    import Tone from 'tone'
    import events from '../../util/events'

export default {
    name: 'CrowdPlayer',
    props: ['publicData', 'privateData'],
    data: () => ({
        instructions: [
            'Please turn up your volume',
            'The Music Nerd will play a song with your phone'
        ],
        synth: null
    }),
    methods: {
    	join() {
		    this.synth.triggerAttackRelease('c4', "16n");
		    this.$emit('action', 'join')
        },
        playNote(note) {
    		if (!note || !this.synth) return

	        let f = Math.pow(2, note / 12) * 440 / 32
	        this.synth.triggerAttackRelease([f, f / 2], ["16n", "128n"]);
        }
    },
    mounted() {
	    this.synth = new Tone.PolySynth(4, Tone.Synth, {
		    oscillator : {
			    type : 'square'
		    } ,
		    envelope : {
			    attack : 0.005 ,
			    decay : 0.2 ,
			    sustain : 0 ,
			    release : 0.1
		    }
	    }).toMaster();
	    setInterval(() => {
		    // synth.triggerAttackRelease(30, "16n");
        }, 500)

	    events.onServerSceneAction = (action) => this.playNote(action.note)
    },
    destroyed() {
    	delete events.onServerSceneAction
    },
	watch: {
		privateData() {
			console.log('note', this.privateData.note)
			// if (this.privateData.note)
            this.playNote(this.privateData.note || 88)
		}
	}
}
</script>

<style scoped lang="stylus">
    @import "../variables.styl"


</style>
