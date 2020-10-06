<template>
        <div class="controlBoard">
            <button v-on:click="connect">Connect</button>
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
    }
}
</script>

<style lang="scss" scoped>
.controlBoard{
    background-color:blue;
}
</style>