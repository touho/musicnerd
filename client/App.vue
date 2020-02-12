<template>
    <div class="App">
        <Error v-if="scene === 'Error'"></Error>
        <EnterName @globalAction="globalAction" v-else-if="shouldEnterName"></EnterName>
        <component
            v-else
            @globalAction="globalAction"
            @action="action"
            :is="component"
            :publicData="publicData"
            :privateData="privateData"
        ></component>

        <div class="paused" v-if="publicData.paused && !privateData.isAdmin">PAUSED</div>
    </div>
</template>

<script>
import _ from 'lodash'
import { scenes } from './scenes/scenes'

let components = _.keyBy(scenes, 'name')

export default {
    name: 'App',
    computed: {
        component() {
            return components[this.scene] || components['Error']
        },
        shouldEnterName() {
        	let name = this.privateData.name
            let isAdmin = this.privateData.isAdmin

            if (isAdmin) return false
            if (!name || name.length <= 1)
                return true
            return false
        },
    },
    watch: {
	    shouldEnterName() {
	    	if (this.shouldEnterName && window.localStorage.musicNerdName) {
			    this.setNameFromLocalStorage()
            }
        },
        component() {
	        if (this.shouldEnterName && window.localStorage.musicNerdName) {
		        this.setNameFromLocalStorage()
	        }
        }
    },
    data: () => ({
        scene: 'Error',
        publicData: {},
        privateData: {},
    }),
    methods: {
        action(name, ...data) {
            if (window.actionHandler) {
	            window.actionHandler(this.scene, ...arguments)
            } else {
                console.warn('No actionHandler for:', name, data)
            }
        },
        globalAction(name, ...data) {
            if (window.actionHandler) {
	            window.actionHandler('', ...arguments)
            } else {
                console.warn('No globalAction actionHandler for:', name, data)
            }

            if (name === 'setName') {
	            try {
		            window.localStorage.musicNerdName = data[0]
	            } catch(e) {
	            }
            }
        },

        setNameFromLocalStorage() {
	        const tryToSetName = () => {
		        if (!window.actionHandler) {
			        setTimeout(tryToSetName, 100)
			        return
		        }
		        this.globalAction('setName', window.localStorage.musicNerdName)
	        }
	        if (window.localStorage.musicNerdName) {
		        tryToSetName()
	        }
        }
    },
    components,
    mounted() {
    	this.setNameFromLocalStorage()
    }
}
</script>

<style scoped lang="stylus">
.App {
    height: 100%
}

    .paused {
        position fixed
        left: 0
        top: 0
        width: 100vw
        height: 100vh
        text-align center
        padding-top: 20vh
        color: rgba(255, 255, 255, 0.6)
        background rgba(99, 99, 99, 0.9)
        font-size 14vw
        user-select none
    }
</style>
