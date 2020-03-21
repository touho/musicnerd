const _ = require('lodash')
const { socketIO } = require('./webserver')
const BaseScene = require('./sceneGames/BaseScene')

socketIO.on('connection', socket => {
    if (!currentScene) {
        setScene('Home')
    }
    connections.push(new Connection(socket))
})

let currentScene = null

const connections = []

module.exports.connections = connections

function sendDatas() {
    for (let connection of connections) {
        connection.sendData()
    }
}

module.exports.sendDatas = sendDatas

function getAdmin() {
    return connections.filter(c => c.isAdmin)[0] || null
}

let scenesWithoutServer = ['Error', 'Home', 'EnterName', 'TheEnd']
function setScene(name, parameters) {
    if (currentScene) {
        currentScene.destroy()
    }
    try {
        let Class = scenesWithoutServer.includes(name)
            ? BaseScene
            : require(`./sceneGames/${name}`)
        currentScene = new Class(name)
        currentScene.emitter.on('sendDatas', sendDatas)
        if (parameters) {
            currentScene.init(...parameters)
        } else {
            currentScene.init()
        }

        for (let connection of connections) {
            connection.privateData = currentScene.getInitialPrivateData()
        }
    } catch (e) {
        console.error(`Failed to set scene ${name}.`, e.message)
    }
}

setInterval(sendDatas, 1000)

let idCounter = 0

class Connection {
    constructor(socket) {
        this.socket = socket
        this.isAdmin = false
        this.name = '-'
        this.id = idCounter++

        this.privateData = currentScene
            ? currentScene.getInitialPrivateData()
            : {}

        socket.on('startAdmin', (event, ...data) => {
            if (getAdmin()) {
                this.socket.emit('err', 'Only one admin allowed.')
                return
            }
            this.isAdmin = true
            console.log('[Admin] Logged in')
            this.sendData()
        })

        socket.on('setName', name => {
            console.log('set name', name)
            this.name = name
        })

        socket.on('message', (...args) => {
            console.warn('Unknown ws event:', args)
        })

        socket.on('action', (scene, name, ...data) => {
            if (this.isAdmin) {
                let handler = {
                    selectScene: (sceneName, parameters) => {
                        setScene(sceneName, parameters)
                    },
                    setState: (state) => {
                        if (!currentScene) return

                        currentScene.setState(state)
                    },
                }[name]
                if (scene !== 'Admin') {
                    console.warn(
                        '[Admin] Action scene was not admin.',
                        scene,
                        name,
                        data
                    )
                } else if (handler) {
                    console.log('[Admin]', scene, name, ...data)
                    handler(...data)
                    sendDatas()
                } else {
                    console.warn('[Admin] Invalid action:', scene, name, data)
                }
            } else {
                console.log(`[action] ${this.name} (${this.id}):`, scene, name, ...data)
                if (!scene) {
                    // Global action
                    if (name === 'setName') {
                        this.name = data[0]
                    }
                } else {
                    // Scene action
                    if (!currentScene || scene !== currentScene.name) {
                        console.warn(
                            `Action not in current scene (${currentScene &&
                            currentScene.name}):`,
                            scene,
                            name,
                            data
                        )
                        return
                    }
                    try {
                        currentScene.handleAction(name, data, this.privateData)
                    } catch(e) {
                        this.socket.emit('err', e.message)
                    }
                }
                this.sendData()
            }
        })

        socket.on('disconnect', () => {
            this.destroyed()
            _.remove(connections, s => s === this)
        })

        this.sendData()
    }
    sendData() {
        if (this.isAdmin) {
            let nonAdminConnections = connections.filter(c => !c.isAdmin)
            this.socket.emit(
                'data',
                'Admin',
                Object.assign(
                    {},
                    currentScene && currentScene.getPublicDataWithExtra(),
                    { scene: currentScene && currentScene.name }
                ),
                {
                    connectionCount: nonAdminConnections.length,
                    privateDatas: nonAdminConnections.map(c =>
                        Object.assign({}, c.privateData, { user: c.name })
                    ),
                    isAdmin: true
                }
            )
        } else {
            if (currentScene) {
                this.socket.emit(
                    'data',
                    currentScene.name,
                    currentScene.getPublicDataWithExtra(),
                    Object.assign({}, this.privateData, { name: this.name })
                )
            } else {
                this.socket.emit('data', 'Error', {}, this.privateData)
            }
        }
    }
    destroyed() {
        if (currentScene) {
            currentScene.connectionLeft(this)
        }
    }
}
