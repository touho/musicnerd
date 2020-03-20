const EventEmitter = require('events');
class SceneEmitter extends EventEmitter {}

module.exports = class BaseScene {
    name = 'BaseScene'
    state = 'instructions' // 'instructions' | 'countdown' | 'running' | 'paused' | 'results'
    countdown = 3

    constructor(name) {
        this.name = name || this.name
        this.emitter = new SceneEmitter()
    }

    init() {

    }

    destroy() {

    }

    // Override me
    getInitialPrivateData() {
        return {}
    }

    // Override me
    getPublicData() {
        return {}
    }

    getPublicDataWithExtra() {
        return Object.assign({}, this.getPublicData(), { state: this.state, countdown: this.countdown })
    }

    // Override me
    handleAction(name, data, privateData) {
        this.callHandler(name, data, {})
    }

    callHandler(name, data, handlers) {
        if (this.state !== 'running') return

        let handler = handlers[name]
        if (handler) {
            handler(...data)
        } else {
            console.warn(`Handler ${name} not found in scene ${this.name}.`)
            throw new Error(`Scene action handler '${name}' not found`)
        }
    }

    get paused() {
        return this.state === 'paused'
    }
    get running() {
        return this.state === 'running'
    }

    setState(state) {
        if (state === 'countdown') {
            this.countdown = 4
            this._interval = setInterval(() => {
                this.countdown--
                console.log('cd', this.countdown)
                if (this.countdown === 0) {
                    clearInterval(this._interval)
                    this.setState('running')
                }
                this.emitter.emit('sendDatas')
            }, 1000)
        }

        this.state = state
        setTimeout(() => this.emitter.emit('sendDatas'), 0)
    }

    connectionLeft() {
    }
}
