<template>
    <li class="animation-screen" :id="'screen-'+source.id" :style="[position]">
        <viewer
            v-bind:style="{
                gridColumnStart:1,
                gridColumnEnd:4,
                gridRowStart:1,
                gridRowEnd:2,
            }"
            v-bind:screenId="source.id" 
            v-bind:filename="source.filename"
            v-bind:isPlaying="isPlaying"
            @registerMovement="registerMovement"
        />
        <controlBoard
            v-bind:style="{
                gridColumnStart:4,
                gridColumnEnd:6,
                gridRowStart:1,
                gridRowEnd:2,
            }"
            v-bind:source="source"
            v-bind:isPlaying="isPlaying"
            @connect="connect"
            @playAndPause="playAndPause"
        />
    </li>
</template>


<script>
import viewer from "./AnimationScreen/AnimationScreenView"
import controlBoard from "./AnimationScreen/AnimationScreenControlBoard"

export default {
    name:"AnimationScreen",
    props:["source"], //data from AnimationContainer
    components:{
        viewer,
        controlBoard
    },
    data(){
        return{
            isPlaying:false
        }
    },
    computed:{
        position(){
            return {
                transform: 'rotate('+this.source.rotateAngle+'deg) translate('+this.source.rotateRadius+') rotate('+this.source.rotateReverseAngle+'deg)'
            }
        }
    },
    methods:{
        connect:function(messageFromChild){
            // event handler - when user push the 'connect' button
            // just passing the event from child to the parent component 
            this.$emit('connect',messageFromChild)
        },
        playAndPause:function(messageFromChild){
            console.log(this.isPlaying)
            this.isPlaying = !this.isPlaying
        },
        registerMovement:function(messageFromChild){
            // passing the movment array to the parent contianer
            this.$emit('registerMovement',messageFromChild)
        }
    },
}
</script>

<style lang="scss" scoped>
.animation-screen{
    position:absolute;

    display:grid;
    grid-template-columns: repeat(5,1fr);
    grid-template-rows: repeat(1,1fr);

    width:250px;
    height:250px;

    &:hover .controlBoard{
		opacity: 1;
	}
}
</style>