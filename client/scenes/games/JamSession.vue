<template>
    <SceneCommon
        :publicData="publicData"
        :instructions="instructions"
        title="Jam Session"
    >
        <div class="Main TestButton" v-if="!privateData.isPlaying">
            <div class="coolText">Select your instrument</div>
            <div
                class="jamInstrument"
                v-for="(instrument, index) of publicData.instruments"
                :class="{
                    selected: index === privateData.instrumentIndex,
                    jamEnding: publicData.jamEnding,
                }"
            >
                <button
                    @click="$emit('action', 'reserve', index)"
                    :disabled="index === privateData.instrumentIndex"
                >
                    {{
                        publicData.reservations[index].length === 0
                            ? 'Play'
                            : 'Queue'
                    }}
                </button>
                <span
                    class="name"
                    :class="{ coolText: index === privateData.instrumentIndex }"
                >
                    {{ instrument.name }}
                </span>
                <div class="progressBar">
                    <div
                        class="progress"
                        :style="{ width: getProgressBarWidth(index) }"
                    ></div>
                </div>
                <div class="reservations">
                    <span
                        v-for="(res, resIndex) of publicData.reservations[
                            index
                        ]"
                    >
                        <span
                            v-if="resIndex === 0"
                            class="reserverName"
                            :class="{
                                coolText:
                                    privateData.queueSlot === 0 &&
                                    privateData.instrumentIndex === index,
                            }"
                            >{{ res.name }}</span
                        >
                        <span
                            v-if="resIndex > 0"
                            class="queueBall"
                            :class="{ me: resIndex === privateData.queueSlot }"
                        ></span>
                    </span>
                </div>
            </div>

            <small class="small"
                >Jam time: {{ publicData.jamTime }} seconds</small
            >
        </div>
        <div v-if="privateData.isPlaying">
            <div class="progressBar">
                <div
                        class="progress"
                        :style="{ width: getProgressBarWidth(privateData.instrumentIndex) }"
                ></div>
            </div>
            <h2 class="coolText">Play {{ instrumentName }}!</h2>

            <button
                class="note"
                v-for="note of notes"
                :style="{
                    filter: `hue-rotate(${Math.round(
                        360 * (note / notes.length)
                    )}deg)`,
                }"
                @click="playNote(note, $event)"
            >
                ♫
            </button>
        </div>
        <div class="Results">
            What a great jam!
        </div>
    </SceneCommon>
</template>

<script>

    const sleep = millis => () => new Promise(resolve => setTimeout(resolve, millis))

export default {
    props: ['publicData', 'privateData'],
    name: 'JamSession',
    data: () => ({
        instructions: [
            'Reserve an instrument to join to jam',
            `If all instruments are reserved you can join a queue`,
        ],
        dataUpdatedAt: Date.now(),
        interval: null
    }),
    computed: {
        instrumentName() {
            let instrument = this.publicData.instruments[
                this.privateData.instrumentIndex
            ]
            return (instrument && instrument.name) || '-'
        },
        notes() {
            let instrument = this.publicData.instruments[
                this.privateData.instrumentIndex
            ]
            if (instrument) {
                return Array(instrument.notes)
                    .fill(0)
                    .map((v, i) => i)
            }
        },
    },
    methods: {
        getProgressBarWidth(instrumentIndex) {
            let reservations = this.publicData.reservations[instrumentIndex]
            if (reservations.length > 0) {
                let secondsPastOnClient =
                    (Date.now() - this.dataUpdatedAt) / 1000
                let secondsLeft =
                    reservations[0].secondsLeft ||
                    this.publicData.reservationSeconds
                secondsLeft -= secondsPastOnClient
                return (
                    Math.round(
                        (secondsLeft / this.publicData.reservationSeconds) * 100
                    ) + '%'
                )
            }
            return '0%'
        },
        playNoteAnimation(target) {

        },
        playNote(note, event) {
	        this.$emit('action', 'playNote', note)

            let target = event.target
	        target.classList.remove('transition')
	        target.classList.add('selected')

            sleep(50)()
            .then(() => target.classList.add('transition'))
            .then(sleep(50))
            .then(() => target.classList.remove('selected'))
        }
    },
    watch: {
        publicData() {
            this.dataUpdatedAt = Date.now()
        },
    },
    mounted() {
        this.interval = setInterval(() => {
            this.$forceUpdate()
        }, 100)
    },
    destroyed() {
        clearInterval(this.interval)
    },
}
</script>

<style scoped lang="stylus">
@import "../variables.styl"
.jamInstrument {
    text-align left
    padding-left: 10vh

    position relative

    line-height: 5vh;

    height: 11vh

    button {
        position absolute
        left 0
        top 0.5vh

        width: 9vh
        height: 9vh

        padding: 0

        font-size 0.7rem
    }
}
.jamInstrument.selected button, .jamInstrument.jamEnding button {
    opacity 0.3
}
.reservations {
    //border: 1px solid $accent-color
}
    .reserverName {
        font-size 0.7rem
    }
.queueBall {
    margin: 0 10px
    display inline-block
    width: 20px;
    height: 20px;
    background $dimmer-color
    border 1px solid $accent-color
    border-radius 50%
    background: radial-gradient(rgba($accent-color, 0), rgba($colorful-color, 0.6));

    vertical-align: middle;

    &.me {
        border 1px solid $colorful-color
        background: radial-gradient(rgba($dimmer-color, 1), rgba($colorful-color, 1));
        box-shadow $colorful-color 0 0 5px, $colorful-color 0 0 20px
    }
}
.progressBar {
    position relative
    border: 1px solid $dimmer-color
    height: 5px

    .progress {
        position absolute
        top -1px
        left 0
        height 5px
        width 50%
        background $colorful-color
    }
}

    h2 {
        margin-top: 0
    }

    button.note {
        display block
        width: 100%
        margin-bottom: 10px
        font-size: 1.3rem
        padding: 0.05rem
        color: rgba($accent-color, 0.5)

        //background $dimmer-color
        //background: radial-gradient(rgba($accent-color, 0), rgba($colorful-color, 0.6));

        box-shadow cyan 0 0 4px

        &.transition {
            transition all 4s
        }

        &.selected {
            color: white
            border-color: white
            box-shadow cyan 0 0 10px 3px
        }
    }
</style>
