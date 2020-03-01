<template>
    <div class="MuteVoting">
        Which instrument should we mute? {{publicData.secondsLeft}} sec

        <div v-for="instrument of Object.keys(publicData.votes)" :class="{ voted: privateData.votedFor === instrument }">
            <div class="instrument">{{instrument}} ({{publicData.votes[instrument]}})
                <button @click="$emit('action', 'vote', instrument)">Vote</button>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: 'MuteVoting',
    props: ['publicData', 'privateData'],
}
</script>

<style scoped lang="stylus">
.MuteVoting {

}
    .voted {
        font-weight bold
        border: 1px solid black
    }
    .instrument {
        font-size 5vh
    }
</style>
