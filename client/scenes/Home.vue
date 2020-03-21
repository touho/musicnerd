<template>
    <div class="Home">
        <SceneCommon :publicData="publicData" title="Music Nerd"></SceneCommon>

        <div class="welcome">Welcome, <span class="coolText">{{privateData.name}}</span>!</div>
        <button @click="$emit('globalAction', 'setName', '-')">Change name</button>
        <br><br>
        <div class="small">The game is starting soon. Please wait and stay alert at all times.</div>
    </div>
</template>

<script>
	export default {
		name: "Home",
		props: ['publicData', 'privateData'],
	}
</script>

<style scoped lang="stylus">
.Home {
}
    .welcome {
        font-size: 1.3rem;
    }
    .small {
        font-size 0.7rem
        padding: 1rem 1rem;
    }
    button {
        font-size 0.5rem
    }
</style>
