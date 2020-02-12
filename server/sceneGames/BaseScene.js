module.exports = class BaseScene {
    name = 'BaseScene'

    paused = false

    constructor(name) {
        this.name = name || this.name
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
        return Object.assign({}, this.getPublicData(), { paused: this.paused })
    }

    // Override me
    handleAction(name, data, privateData) {
        this.callHandler(name, data, {})
    }

    callHandler(name, data, handlers) {
        if (this.paused) return

        let handler = handlers[name]
        if (handler) {
            handler(...data)
        } else {
            console.warn(`Handler ${name} not found in scene ${this.name}.`)
        }
    }
}
