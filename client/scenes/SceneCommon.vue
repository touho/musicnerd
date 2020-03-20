<template>
    <div
        class="Scene"
        :class="{
            showMain: ['countdown', 'running', 'paused'].includes(
                publicData.state
            ) || brightTitle,
            showResults: publicData.state === 'results',
        }"
    >
        <div class="title">{{ title }}</div>

        <div class="padding">
            <div
                class="instructions alignedSection"
                v-if="publicData.state === 'instructions' && instructions"
            >
                <div class="subTitle">Instructions:</div>
                <ul>
                    <Instruction
                        v-for="(instruction, index) of instructions"
                        :key="'scenecommoninsts' + index"
                        :publicData="publicData"
                        :delay="0.8 + index * 0.3"
                        :instruction="instruction"
                        ></Instruction
                    >
                </ul>
            </div>

            <div class="Results subTitle alignedSection">
                End results:
            </div>

            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SceneCommon',
    props: ['title', 'publicData', 'instructions', 'brightTitle'],
}
</script>

<style scoped lang="stylus">
@import './common.styl';

.Scene:not(.showMain) .Main {
    display none
}
.Scene:not(.showResults) .Results {
    display none
}
    .padding {
        padding: 1vh 5vw
        max-width 800px
        margin: auto
    }
.alignedSection {
    text-align left
}
.title {
    //background rgba(255, 255, 255, 0.2)
    background-image: radial-gradient(rgba($colorful-color, 0.1), rgba($dimmer-color, 0.1));
    font-size: 1.3rem;
    //background $bg-color
    padding: 0px 10px;
    /*padding: 50px;*/
    font-weight 100;
    margin-bottom: 2vh
    transition all 0.3s ease

    text-shadow: rgba($font-color, 1) 0 0 5px, $font-color 0 0 23px;
    color: black;
}
.Scene.showMain .title {
    //font-size 0.7rem;
    color: $font-color
}

.subTitle {
    text-shadow: rgba($font-color, 1) 0 0 5px, rgba($font-color, 1) 0 0 8px, $font-color 0 0 23px;
    color: black;
}
</style>
