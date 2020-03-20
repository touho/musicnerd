<template>
    <div class="Home">
        <SceneCommon
            :publicData="publicData"
            :brightTitle="true"
            title="The End"
        ></SceneCommon>

        <div class="coolText thankYouText">Thank you for playing Music Nerd!</div>

        <div class="worm">
            <div
                    class="target"
                    :style="{
                top: Math.round(y) + 'px',
                left: Math.round(x) + 'px',
                filter: `grayscale(${Math.round(100 - 100 * Math.sqrt(heatValue + 0.2))}%)`,
                'box-shadow': `#00eeff 0 0 ${Math.round(heatValue * 20)}px, #00eeff 0 0 ${Math.round(heatValue * 30)}px`
            }"
            >
                <div class="targetBackground" :style="{
            	opacity: heatValue
            }"></div>
                <div class="targetIcon coolText">♫</div>
            </div>

            <div
                class="wormBall"
                v-for="(ball, index) of worm"
                v-if="index % 2 === 0"
                :key="'worm' + index"
                :style="{
                    left: Math.round(ball[0]) + 'px',
                    top: Math.round(ball[1]) + 'px',
                    height: getWormBallSize(index) + 'px',
                    width: getWormBallSize(index) + 'px',
                }"
            ></div>
        </div>
    </div>
</template>

<script>
import Vector from '../util/Vector'
import _ from 'lodash'

export default {
    name: 'TheEnd',
    props: ['publicData', 'privateData'],
    data: () => ({
        x: 200,
        y: 300,
        turnDirection: 1,
        turnSpeed: 4,
        direction: 0,
        worm: [],
        speed: 300,
        length: 100,
        heatPoints: 0,
    }),
    computed: {
    	heatValue() {
    		return _.clamp(Math.pow(this.heatPoints, 0.5) * 2.5 - 0.2, 0, 1)
        }
    },
    mounted() {
        const handler = e => {
            if (e.type === 'mousemove' && !e.buttons) return
            this.x = e.touches ? e.touches[0].clientX : e.clientX
            this.y = e.touches ? e.touches[0].clientY : e.clientY
            e.preventDefault()
        }

        let listenerOptions = {
            passive: false,
            capture: true,
        }

        window.addEventListener('mousedown', handler, listenerOptions)
        window.addEventListener('mousemove', handler, listenerOptions)
        window.addEventListener('touchstart', handler, listenerOptions)
        window.addEventListener('touchmove', handler, listenerOptions)

        let fps = 30

        let confusedUntil = 0

        const update = () => {
            let dt = 1 / fps
            let position = Vector.fromArray(this.worm[0])
            let delta = new Vector(1, 0)
                .rotate(this.direction)
                .multiplyScalar(this.speed * dt)
            position.add(delta)

            let distanceFromTarget = new Vector(this.x, this.y).subtract(position).length()
            if (distanceFromTarget < 60) {
                confusedUntil = Date.now() + 100
            }

            let minSpeed = 120
            let maxSpeed = 400
            let minDistance = 100
            let maxDistance = 400
            if (distanceFromTarget < minDistance) {
            	this.speed = minSpeed
            } else if (distanceFromTarget > maxDistance) {
            	this.speed = maxSpeed
            } else {
            	this.speed = minSpeed + (maxSpeed - minSpeed) * (distanceFromTarget - minDistance) / (maxDistance - minDistance)
            }

            this.direction += this.turnDirection * dt * (this.turnSpeed + this.speed / 200)

            for (let i = this.worm.length - 1; i >= 1; i--) {
                this.worm[i] = this.worm[i + -1]
            }
            this.worm[0] = position.toArray()

            let target = new Vector(this.x, this.y)
	        this.heatPoints = this.worm.map(p => Vector.fromArray(p).distanceSq(target)).reduce((prev, curr) => {
	        	return prev + Math.min(1, 10 / (curr + 800))
            },  0)

            this.$forceUpdate()
        }

        this.worm = [[this.x, this.y]]
        const addWormBallWithDelay = (delay) => setTimeout(() => this.worm.push(this.worm[this.worm.length - 1]), delay)
        for (let i = 1; i < this.length; i++) {
        	addWormBallWithDelay(i * 12)
        }
        setInterval(update, 1000 / fps)

        const updateDirection = () => {
	        if (Date.now() > confusedUntil) {
		        let position = Vector.fromArray(this.worm[0])
		        let targetDirection = new Vector(this.x, this.y).subtract(
			        position
		        )
		        let direction = new Vector(1, 0).rotate(this.direction)
		        this.turnDirection =
			        direction.cross(targetDirection) > 0 ? 1 : -1
	        } else {
		        this.turnDirection = this.turnDirection > 0 ? -1 : 1
	        }
	        setTimeout(updateDirection, 150 + Math.random() * 200 - this.speed / 3)
        }
	    setTimeout(updateDirection, 300)
    },
    destroyed() {
        window.location.reload()
    },
    methods: {
        getWormBallSize(index) {
            return Math.round(10 + 200 / (index + 7))
        },
    },
}
</script>

<style scoped lang="stylus">
    @import "variables.styl"
.Home {
}
    .thankYouText {
        width: 90%
        max-width 40vh
        margin: auto auto
    }
    .target {
        border: 2px solid
        border-radius 50%
        width: 80px;
        height: 80px;

        position absolute
        left: 50px
        top: 200px

        overflow hidden

        pointer-events none

        transform translate(-50%, -50%)

        // This is overridden
        //box-shadow $colorful-color 0 0 5px, rgba($colorful-color, .5) 0 0 20px

        .targetIcon {
            position absolute
            left: 50%;
            top: 50%;
            transform translate(-50%, -50%)
            font-size 40px;
        }

        .targetBackground {

            position: absolute;
            z-index: -1;

            content ""
            background #00f1ff;
            opacity: 0
            ///*position absolute*/
            top: 0
            left: 0
            width: 100%
            height: 100%
        }
    }

        .worm {
            overflow hidden
            position absolute
            width: 100%
            height:    100vh
            top: 0
            left: 0
        }

    .wormBall {
        width: 20px;
        height 20px
        left: 0
        top: 0
        border-radius 50%
        position absolute
        animation colorWorm infinite 30s
    }

    @keyframes colorWorm {
        0% {
            background $colorful-color
            box-shadow $colorful-color 0 0 5px, $colorful-color 0 0 20px
        }
        12% {
            background $colorful-color
            box-shadow $colorful-color 0 0 5px, $colorful-color 0 0 20px
        }
        17% {
            background #663afe
            box-shadow #000eff 0 0 5px, #001dff 0 0 20px
        }
        20% {
            background #a624b6
            box-shadow #ff00ee 0 0 5px, #ff00ee 0 0 20px
        }
        30% {
            background #ffc1ed
            box-shadow #ff00ee 0 0 5px, #ff00ee 0 0 20px
        }
        36% {
            background black
            box-shadow #ff00ee 0 0 5px, #ff00ee 0 0 20px
        }
        40% {
            background black
            box-shadow black 0 0 5px, black 0 0 20px
        }
        55% {
            background #99FF8E
            box-shadow #00ff1b 0 0 5px, #80ff70 0 0 20px
        }
        59.5% {
            background #99FF8E
            box-shadow #00ff1b 0 0 5px, #80ff70 0 0 20px
        }
        60% {
            background #000000
            box-shadow #ff0012 0 0 5px, #ff0013 0 0 20px
        }
        63.5% {
            background #000000
            box-shadow #ff0012 0 0 5px, #ff0013 0 0 20px
        }
        64% {
            background #99FF8E
            box-shadow #00ff1b 0 0 5px, #80ff70 0 0 20px
        }
        70.5% {
            background #99FF8E
            box-shadow #00ff1b 0 0 5px, #80ff70 0 0 20px
        }
        71% {
            background #000000
            box-shadow #ff0012 0 0 5px, #ff0013 0 0 20px
        }
        73.5% {
            background #000000
            box-shadow #ff0012 0 0 5px, #ff0013 0 0 20px
        }
        74% {
            background #99FF8E
            box-shadow #00ff1b 0 0 5px, #80ff70 0 0 20px
        }
        85% {
            background #ebfffc
            box-shadow #fe00ff 0 0 5px, box-shadow #fe00ff 0 0 9px, #0032ff 0 0 20px
        }
        100% {
            background $colorful-color
            box-shadow $colorful-color 0 0 5px, $colorful-color 0 0 20px
        }
    }
</style>
