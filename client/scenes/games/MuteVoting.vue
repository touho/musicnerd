<template>
    <SceneCommon
        :publicData="publicData"
        :instructions="instructions"
        title="Mute Voter!"
    >
        <div class="MuteVoting Main">
            Time left: {{ publicData.secondsLeft }} seconds

            <div
                    v-for="instrument of publicData.instruments"
                    :class="{ voted: privateData.votedFor === instrument, muted: isNaN(publicData.votes[instrument]) }"
            >
                <div class="instrument">
                    {{ instrument }}
                    <button :disabled="isNaN(publicData.votes[instrument])" @click="$emit('action', 'vote', instrument)">
                        Vote
                    </button>
                    <div class="votingContainer">
                        <div class="votings" :style="{ width: percentage(instrument) + '%' }"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="Results">
            <h2 class="coolText">
                {{survivedInstrument}} survived!
            </h2>
        </div>
    </SceneCommon>
</template>

<script>
export default {
    name: 'MuteVoting',
    props: ['publicData', 'privateData'],
    data: () => ({
	    instructions: [
	    	'<b>Vote</b> for an instrument',
	    	'The instrument with most votes will be <red>muted</red>',
            `Let's see which instrument <green>survives</green>!`
        ]
    }),
    computed: {
    	survivedInstrument() {
    		return Object.keys(this.publicData.votes)[0]
        }
    },
    methods: {
    	percentage(instrument) {
    		return Math.pow(this.publicData.votes[instrument] / this.publicData.activeUsers, 0.8) * 100
        }
    }
}
</script>

<style scoped lang="stylus">
    @import "../variables.styl"

    $font-size = 4.5vh

.MuteVoting {
text-align left
}
    .voted:not(.muted) {
        font-weight bold
        /*border: 1px solid black*/
        text-shadow $font-color 0 0 3px

        button {
            background: radial-gradient(rgba($accent-color, 0), rgba($colorful-color, 0.6));
        }
    }
        .muted {
            color: red;
            button {
                opacity 0
            }
            .votingContainer {
                opacity 0
                background red
                border-color: red
                .votings {
                    background red
                }
            }
        }
    .instrument {
        font-size $font-size
        margin-bottom: 3vh
        transition all 1s
        button {
            transition all 1s
        }
        .votingContainer {
            transition all 1s
        }
    }

    .votingContainer {
        position relative
        height: 1rem;
        border: 1px solid $accent-color
        box-sizing border-box
        /*overflow hidden*/
        .votings {
            position absolute
            top: -0.5px
            left: -0.5px
            bottom: -0.5px
            width: 0% // override me
            display inline-block
            background $accent-color
        }
    }

    button {
        float: right
        vertical-align: center
        line-height $font-size
    }


</style>
