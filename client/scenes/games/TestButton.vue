<template>
    <SceneCommon :publicData="publicData" :instructions="instructions" title="Let's test a long one!">


        <div class="Main TestButton">Test button
            <div @click="$emit('action', 'click')">Click me</div>

            <div>Your clicks: {{privateData.clicks}} of {{publicData.clicks}}</div>
        </div>
        <div class="Results">
            my results are like this
        </div>
    </SceneCommon>
</template>

<script>
	export default {
		props: ['publicData', 'privateData'],
		name: "TestButton",
        data: () => ({
	        instructions: [
		        'First, press the button',
                'Then profit!'
	        ]
        })
	}
</script>

<style scoped lang="stylus">
    .TestButton {
        border: 1vh solid red
        height: 100%
    }
</style>
