<template>
    <div class="Home">

        <h2>Music Nerd</h2>

        <div>Welcome, {{privateData.name}}!</div>
        <br>
        <div>Please listen to the instructions.</div>

        <button @click="$emit('globalAction', 'setName', '-')">Change name</button>
    </div>
</template>

<script>
	export default {
		name: "Home",
		props: ['publicData', 'privateData'],
	}
</script>

<style scoped lang="stylus">
    h2 {
        color: #ff00ff
    }
.Home {
text-align center
}
</style>
