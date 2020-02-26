<template>
    <div class="MidiTest">

        <div v-for="(scene, id) in scenes" @click="$emit('action', 'startScene', id)" :class="{ sel: publicData.scene == id }">{{ scene }}</div>

    </div>
</template>

<script>
	export default {
		props: ['publicData', 'privateData'],
		name: "MidiTest",
        data: () => ({
            scenes: [
            	'Soita vähän',
                'Soita veikeää',
                'Soita ahdistavasti',
                'Soita levottomasti',
                'Lopeta',
            ]
        })
	}
</script>

<style scoped lang="stylus">
    .MidiTest {
        border: 1vh solid red
        height: 100%
        padding: 10px
    }

    .sel {
        color: green;
    }
</style>
