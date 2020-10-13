<template>
        <div class="controlBoard">
            <button v-on:click="connect">Connect</button>
            <button v-if="isPlaying" v-on:click="playAndPause">Pause</button>
            <button v-if="!isPlaying" v-on:click="playAndPause">Play</button>
        </div>
</template>

<script>
export default {
    name:"ControlBoard",
    props:{source:{required:true}, isPlaying:{type:Boolean,required:true}},
    data(){
    },
    methods:{
        connect:function(){
            this.$emit('connect',this.source.id)
        },
        playAndPause:function(){
            this.$emit('playAndPause')
        }
    }
}
</script>

<style lang="scss" scoped>
.controlBoard{
    background-color:blue;
}
</style>