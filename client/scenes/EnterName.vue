<template>
    <div class="EnterName">
        <h3>Please, enter your name</h3>

        <input ref="input" type="text" v-model="name" @keypress="keypress"><br>
        <br>
        <button @click="setName">Enter the game</button>
    </div>
</template>

<script>
	export default {
		name: "EnterName",
        data: () => ({
            name: ''
        }),
        methods: {
			keypress(e) {
				if (e.key === 'Enter') {
					this.setName()
                }
            },
            setName() {
	            this.$emit('globalAction', 'setName', this.name)
            }
        },
		mounted() {
			this.$nextTick(() => this.$refs.input.focus())
		}
	}
</script>

<style scoped lang="stylus">
.EnterName {
    text-align: center;
}
    input {
        width: 90%
    }
    button {
        font-size 4vh
        padding: 5px 20px
    }
</style>
