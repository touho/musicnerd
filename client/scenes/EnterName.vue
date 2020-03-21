<template>
    <div class="EnterName">
        <h3>Please, enter your name</h3>

        <input :maxlength="20" ref="input" type="text" v-model="name" @keypress="keypress"><br>
        <br>
        <button @click="setName">Go in!</button>
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
    @import "common.styl"
.EnterName {
    text-align: center;
}
    input {
        width: 90%
        background black
        border: 1px solid $accent-color
        color: $font-color
        text-align center
    }
</style>
