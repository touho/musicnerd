<template>
    <div class="TestButton">Test button



    <div @click="$emit('action', 'click')">Click me</div>

        <div>Your clicks: {{privateData.clicks}} of {{publicData.clicks}}</div>
    </div>
</template>

<script>
	export default {
		props: ['publicData', 'privateData'],
		name: "TestButton"
	}
</script>

<style scoped lang="stylus">
    .TestButton {
        border: 1vh solid red
        height: 100%
    }
</style>
