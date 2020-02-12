export function createSocket(stateDataHandler) {
    return new Socket(stateDataHandler)
}

let isAdmin = false

class Socket {
    constructor(stateDataHandler) {
        this.stateDataHandler = stateDataHandler

        this.socket = window.io()

        this.socket.on('connect', function() {})
        this.socket.on('data', function(scene, publicData, privateData) {
            stateDataHandler(...arguments)

            // console.log('data', ...arguments)

            if (scene === 'Admin' && !isAdmin) {
                console.log('[Admin] Welcome! ;)')
            }
            isAdmin = scene === 'Admin'
        })

        this.socket.on('message', function(data) {
            console.log('message', data)
        })
        this.socket.on('err', function(data) {
            console.error('error', data)
        })
        this.socket.on('disconnect', function() {
            stateDataHandler('Error', {}, {})
        })
    }

    startAdmin() {
        this.socket.emit('startAdmin')
    }

    sendAction() {
        console.log('sendAction', ...arguments)
        this.socket.emit('action', ...arguments)
    }
}
