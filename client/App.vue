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

        <div class="paused" v-if="publicData.state === 'paused' && !privateData.isAdmin">PAUSED</div>
        <div ref="countdown" class="countdown">{{publicData.countdown}}</div>
    </div>
</template>

<script>
import _ from 'lodash'
import { scenes } from './scenes/scenes'

let components = _.keyBy(scenes, 'name')

let nameSettingTimeout = null

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
        countdown() {
        	if (this.publicData.state === 'countdown')
        	    return this.publicData.countdown
            else
            	return 0
        },
        state() {
        	return this.publicData.state
        }
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
        },
	    countdown() {
	    	if (this.publicData.state === 'instructions')
	    		return
	    	if (this.countdown > 0 && this.countdown <= 3) {
                this.shoutText(this.countdown)
            } else if (this.countdown === 0) {
			    this.shoutText('Go!')
            }
        },
        state() {
	    	if (this.state === 'results') {
			    this.shoutText('END')
            }
        }
    },
    data: () => ({
        scene: 'Error',
        publicData: {},
        privateData: {},
    }),
    methods: {
    	shoutText(text) {
            this.$refs.countdown.textContent = text
            this.$refs.countdown.classList.add('countdownAnimation')
            setTimeout(() => this.$refs.countdown.classList.remove('countdownAnimation'), 900)

        },
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
        	if (nameSettingTimeout) {
        		return
            }

	        const tryToSetName = () => {
		        nameSettingTimeout = null
		        if (!window.actionHandler) {
			        nameSettingTimeout = setTimeout(tryToSetName, 100)
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
    /*height: 100%*/
    text-align center
}

    .paused {
        position fixed
        left: 0
        top: 0
        width: 100vw
        height: 100vh
        text-align center
        padding-top: 20vh
        //color: rgba(255, 255, 255, 0.6)
        background rgba(0, 0, 0, 0.9)
        font-size 14vw
        user-select none
    }
    .countdown {
        position fixed
        top: 40%
        font-size 45vw
        left: 50%
        transform translateX(-50%) translateY(-50%)
        opacity 0
        pointer-events: none;
        &.countdownAnimation {
            animation countdown 0.8s cubic-bezier(0.5, 0, 0.5, 0)
        }
    }
@keyframes countdown {
    0% {
        opacity 1
        font-soze: 30vh
    }
    100% {
        opacity 0
        font-size: 10vh
    }
}
</style>
