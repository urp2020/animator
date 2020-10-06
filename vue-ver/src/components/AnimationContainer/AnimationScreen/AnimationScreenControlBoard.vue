<template>
        <div class="controlBoard">
            <button v-on:click="connect">Connect</button>
            <button v-on:click="open">open file</button>
        </div>
</template>

<script>
export default {
    name:"ControlBoard",
    props:['source'],
    data:{},
    methods:{
        connect:function(){
            this.$emit('connect',this.source.id)
        },
        open:function(){
        }
    }
}
</script>

<style lang="scss" scoped>
.controlBoard{
    background-color:blue;
}
</style>