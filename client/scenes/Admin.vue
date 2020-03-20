<template>
    <div class="Admin">
        <h2>[Admin]</h2>

        <div class="section">
            <div class="sectionTitle">All scenes</div>
            <template v-for="scene of scenes">
                <button
                    :class="{ selected: scene.name === publicData.scene }"
                    @click="selectScene(scene.name)"
                >
                    {{ scene.name }}
                </button>
                <br />
            </template>

            <div class="sectionTitle">Custom</div>
            <template v-for="customScene of customScenes">
                <button
                    :class="{
                        selected: customScene.scene.name === publicData.scene,
                    }"
                    @click="
                        selectScene(
                            customScene.scene.name,
                            customScene.parameters
                        )
                    "
                >
                    {{ customScene.name }}
                </button>
                <br />
            </template>
        </div>

        <div class="section">
            <div class="sectionTitle">Tools</div>
            <button ref="startButton" class="startButton" v-if="publicData && publicData.state === 'instructions'" @click="$emit('action', 'setState', 'countdown')">Start!</button>
            <button v-if="publicData && publicData.state === 'running'" @click="$emit('action', 'setState', 'paused')">Pause</button>
            <button v-if="publicData && publicData.state === 'paused'" @click="$emit('action', 'setState', 'running')">Continue</button>
            <button v-if="publicData && publicData.state === 'running'" @click="$emit('action', 'setState', 'results')">Stop!</button>
        </div>

        <div class="section">
            <div class="sectionTitle">Public data</div>

            <div class="smallText">
                <div v-for="key of Object.keys(publicData)">
                    {{ key }}: {{ publicData[key] }}
                </div>
            </div>
        </div>

        <div class="section">
            <div class="sectionTitle">Private data</div>

            <table class="smallText">
                <tr>
                    <th v-for="column of columns" @click="sort(column)">
                        {{ column }}
                    </th>
                </tr>

                <tr v-for="data of sortedPrivateDatas">
                    <td v-for="column of columns">{{ data[column] }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import { scenes } from './scenes'
import _ from 'lodash'

const HIDDEN_SCENES = ['Admin', 'EnterName', 'Error']

export default {
    name: 'Admin',
    props: ['publicData', 'privateData'],
    data: () => ({
        scenes: scenes.filter(s => !HIDDEN_SCENES.includes(s.name)),
        sortPrivateKey: null,
        sortInverse: false,
        customScenes: [
	        {
	        	name: 'MuteVoting 4instr 2-2-2',
		        scene: scenes.find(s => s.name === 'MuteVoting'),
		        parameters: [['Bass', 'Guitar', 'Keyboards', 'Vocals'], [2, 2, 2]],
	        },
	        {
		        name: 'MuteVoting 4instr 50-50-50',
		        scene: scenes.find(s => s.name === 'MuteVoting'),
		        parameters: [['Bass', 'Guitar', 'Keyboards', 'Vocals'], [50, 50, 50]],
	        },
        ],
    }),
    computed: {
        columns() {
            let privateDatas = this.privateData.privateDatas

            if (privateDatas.length === 0) return []

            let userField = 'user'
            return Object.keys(privateDatas[0]).sort((a, b) => {
                if (a === userField) return -1
                else if (b === userField) return 1
                else return a.localeCompare(b)
            })
        },
        sortedPrivateDatas() {
            let data = this.privateData.privateDatas

            if (this.sortPrivateKey)
                data = _.sortBy(
                    this.privateData.privateDatas,
                    this.sortPrivateKey
                )

            if (this.sortInverse) data = data.reverse()

            return data
        },
    },
    mounted() {
    	window.addEventListener('keydown', e => {
    		if (e.key === 'Enter' || e.key === ' ') {
    			if (this.publicData.state === 'instructions') {
		            this.$refs.startButton.click();
                }
            }
        })
    },
	methods: {
        selectScene(sceneName, parameters) {
            this.$emit('action', 'selectScene', ...arguments)
        },
        sort(column) {
            if (column === this.sortPrivateKey) {
                this.sortInverse = !this.sortInverse
            } else {
                this.sortInverse = false
                this.sortPrivateKey = column
            }
        },
    },
}
</script>

<style scoped lang="stylus">
h2 {
    margin: 10px 5px
}

    button.selected {
        font-weight bold
    }

.Admin {
    font-size 16px
    padding: 0 20px
    user-select text
}
.section {
    display inline-block
    border: 1px solid purple
    padding: 10px

    vertical-align: top;

    .sectionTitle {
    }
}
.smallText {
    font-family Helvetica, sans-serif
    font-size 14px
}
    .startButton {
        padding: 10px;
        font-size: 30px;
    }
</style>
