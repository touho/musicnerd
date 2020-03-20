<template>
    <li class="instruction" :class="{ visible }" v-html="instruction"></li>
</template>

<script>
export default {
    name: 'Instruction',
    props: ['delay', 'publicData', 'instruction'],
    data: () => ({
        visible: false,
    }),
    mounted() {
        console.log('instruction mounted')
        setTimeout(() => (this.visible = true), this.delay * 1000)
    },
}
</script>

<style scoped lang="stylus">
    @import "common.styl"
.instruction {
    position relative
    left: 150%;
    opacity: 0;
    transition all 0.6s
}
.visible {
    left: 0
    opacity: 1;
}
    >>>b {
        text-shadow $font-color 0 0 3px
    }
    >>>red {
        color: #ff9999;text-shadow: #ff6e6e 0 0 2px, #ff0000 0 0 22px, #ff0000 0 0 4px;
    }
    >>>green {
        color: #85ffa5;text-shadow: #007104 0 0 22px, #008c2b 0 0 5px;
    }
    >>>gold {
        color: #ffd700;
        text-shadow: #f3ff3aa3 0 0 18px, #b5b5b5 0 0 5px;
    }
</style>
