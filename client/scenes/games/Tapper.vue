<template>
    <SceneCommon
        :publicData="publicData"
        :instructions="instructions"
        title="Tapper Boss"
    >
        <div class="Tapper Main">
            <div class="tap" v-if="publicData.status === 'tap'">
                <h2>{{ publicData.secondsLeft }} secs left</h2>

                <div
                    class="tapArea"
                    @mousedown="mouseDown"
                    @touchstart="touchStart"
                >
                    <div class="tapCount coolText">
                        {{ privateData.taps > 0 ? privateData.taps : 'TAP' }}
                    </div>
                </div>

                <div v-if="privateData.taps >= publicData.leaderTaps">
                    You are in the lead!
                </div>
                <div v-else>
                    You are {{ publicData.leaderTaps - privateData.taps }} taps
                    behind!
                </div>
            </div>
            <div class="tapResults" v-if="publicData.status === 'tapResults'">
                <div>You are rank #{{ privateData.rank }}</div>
                <div
                    class="tapResult"
                    v-for="(tapResult, index) of publicData.tapResults"
                    :class="{
                        'tapResult-boss': index === 0,
                        'tapResult-me': index === privateData.rank - 1,
                        coolText: index === privateData.rank - 1,
                    }"
                >
                    {{ index + 1 }}. {{ tapResult.name }}
                    <span class="taps">{{ tapResult.taps }}</span>
                </div>
            </div>
            <div class="boss" v-if="publicData.status === 'boss'">
                <span class="coolText">{{
                    privateData.isBoss ? 'You' : publicData.bossName
                }}</span>
                can control the music for {{publicData.secondsLeft}} seconds. <span v-if="!privateData.isBoss">Please wait and enjoy.</span>

                <div class="bossControls">
                    <div
                        class="bossControl"
                        v-for="(control, index) of publicData.bossControls"
                        @click="$emit('action', 'bossControl', index)"
                        :class="{
                        	selected: publicData.currentlyPlayingControlIndex === index
                        }"
                    >
                        <div :class="{isIcon: control.length <= 2}">{{ control }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="Results">
            <div class="bossResult" v-for="(bossName, index) of publicData.bossNames">{{index + 1}}. Boss was <span class="coolText">{{bossName}}</span></div>
        </div>
    </SceneCommon>
</template>

<script>
function is_touch_device4() {
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')

    var mq = function(query) {
        return window.matchMedia(query).matches
    }

    if (
        'ontouchstart' in window ||
        (window.DocumentTouch && document instanceof DocumentTouch)
    ) {
        return true
    }

    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
    // https://git.io/vznFH
    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('')
    return mq(query)
}

export default {
    name: 'Tapper',
    props: ['publicData', 'privateData'],
    data: () => ({
        instructions: [
            '<b>Tap</b> as fast as you can',
            'The fastest tapper becomes <gold>The Boss</gold> and can control the music',
            'There might be multiple rounds',
        ],
    }),
    methods: {
        tap() {
            setTimeout(() => this.$emit('action', 'tap'), 0)
        },
        touchStart() {
            if (is_touch_device4()) {
                this.tap()
            }
        },
        mouseDown() {
            if (!is_touch_device4()) {
                this.tap()
            }
        },
    },
}
</script>

<style scoped lang="stylus">
    @import "../variables.styl"

.Tapper {
    text-align center
    user-select none

}
.tapArea {
    position relative
    color: white

    margin: 0 auto

    max-width 300px;
    max-height 300px;
    width: 80vw
    height: 80vw

    background rgba($dimmer-color, 0.2)
    border: 2px solid $colorful-color
    box-shadow $colorful-color 0 0 10px
    .tapCount {
        font-size: 100px
        position absolute
        top: 50%;
        left: 50%;
        transform translateX(-50%) translateY(-50%)
    }

    &:active {
        background rgba($colorful-color, 0.2)
        box-shadow $colorful-color 0 0 10px, rgba($colorful-color, 0.4) 0 0 30px
    }
}

    .tapResult {
        text-align left

        .taps {
            float right
        }

        &.tapResult-boss {
            font-size 1.5rem
        }
        &.tapResult-boss {
        }
    }

    .boss {

        .bossControl {
            display inline-block
            border: 1px solid $dimmer-color
            width: 25vw;
            height: 25vw;
            max-width: 200px;
            max-height: 200px;

            background $bg-color-dark


            &.selected {
                border: 1px solid $accent-color
                box-shadow $colorful-color 0 0 5px
                background $bg-color
                background: radial-gradient(rgba($accent-color, 0), rgba($colorful-color, 0.6));
                text-shadow: #01dcff 0 0 16px;
                text-shadow: #8ee9ff 0 0 16px;
            }

            position relative

            margin: 8px

            div {
                position absolute
                top 50%
                left 50%
                transform translate(-50%, -50%)
                font-size 20px
                line-height 22px
                &.isIcon {
                    font-size 50px
                }
            }
        }
    }
    .bossResult {
        text-align left
    }
</style>
