<template>
    <SceneCommon
        :publicData="publicData"
        :instructions="instructions"
        title="Tapper"
    >
        <div class="Tapper Main">
            <h2>{{ publicData.secondsLeft }} secs left</h2>

            <div class="tapArea" @click="$emit('action', 'tap')">
                <div class="tapCount coolText">{{ privateData.taps > 0 ? privateData.taps : 'TAP' }}</div>
            </div>

            <div v-if="privateData.taps >= publicData.leaderTaps">
                You are in the lead!
            </div>
            <div v-else>
                You are {{ publicData.leaderTaps - privateData.taps }} taps
                behind!
            </div>
        </div>
    </SceneCommon>
</template>

<script>
export default {
    name: 'Tapper',
    props: ['publicData', 'privateData'],
    data: () => ({
        instructions: [
            '<b>Tap</b> as fast as you can',
            'The fastest tapper gets <gold>glory!</gold>',
            'There will be many rounds',
        ]
    }),
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
</style>
