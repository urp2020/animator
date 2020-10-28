<template>
        <div class="controlBoard">
            <button class="btn" v-on:click="connect"
                    v-bind:style="{
                        gridColumnStart:1,
                        gridColumnEnd:2,
                        gridRowStart:7,
                        gridRowEnd:8,
                    }"
                    >Connect</button>
            <button class="btn playbtn" v-if="isPlaying" v-on:click="playAndPause">Pause</button>
            <button class="btn playbtn" v-if="!isPlaying" v-on:click="playAndPause">Play</button>
        </div>
</template>

<script>
export default {
    name:"ControlBoard",
    props:{source:{required:true}, isPlaying:{type:Boolean,required:true}},
    data(){
        return{
            
        }
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
    //background-color:blue;
    opacity: 0;
    transition: opacity .5s;
    padding-left:1em;
    display:grid;
    grid-template-columns: repeat(1,1fr);
    grid-template-rows: repeat( 8,1fr);
    grid-row-gap:0.25em;
    .btn{
        transition: box-shadow .3s;
        background: none;

        border: 2px solid black;
        border-radius: 5px;
        font: inherit;
        line-height: 1;
   
        color: black;
        text-align: center;
        text-decoration: none;
        cursor: pointer;

        &:hover{
            box-shadow: 5px 5px  rgba(0, 0, 0, 0.74); 
        }
    }

    .playbtn{
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 8;
        grid-row-end: 9;
       
    }
}
</style>