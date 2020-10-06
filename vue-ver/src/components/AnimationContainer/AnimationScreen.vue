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
        />
        <controlBoard
            v-bind:style="{
                gridColumnStart:1,
                gridColumnEnd:4,
                gridRowStart:2,
                gridRowEnd:3,
            }"
            v-bind:source="source"
            @connect="connect"
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
    data:{

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
        }
    },
}
</script>

<style lang="scss" scoped>
.animation-screen{
    position:absolute;

    display:grid;
    grid-template-columns: repeat(3,1fr);
    grid-template-rows: 4fr 1fr;

    width:250px;
    height:250px;
}
</style>