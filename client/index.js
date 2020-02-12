import { createSocket } from './socket'

let socket
window.addEventListener('load', function() {
    socket = createSocket(function(scene, publicData, privateData) {
        let app = getApp()
        app.scene = scene
        app.publicData = publicData
        app.privateData = privateData
    })

    window.actionHandler = function() {
        socket.sendAction(...arguments)
    }

    if (window.location.hash.includes('admin')) {
        socket.startAdmin()
    }
})

window.actionHandler = null

import Vue from 'vue'
import App from './App'

let rootComponent = new Vue({
    el: '#app',
    render: h => h(App, {}),
})
function getApp() {
    return rootComponent.$children[0]
}

window.admin = () => socket.startAdmin()
