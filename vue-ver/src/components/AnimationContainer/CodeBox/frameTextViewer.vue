<template>
    <div class="frames">
        <div class="each-frame"
        v-for="(animation, index) in animations"
        v-bind:key="index"
        >   
        <!-- animation structure is defined in AnimationContainer.vue-->
            <div class="filename">{{animation.file.name}}</div>
            <div class="angles">{{genearteTextFromMovements(animation.movement)}}</div>
        </div>
    </div>
</template>


<script>

import {genearteTextFromMovements} from './../../../logic/AnimationExtractor'
import JSzip from 'jszip';



export default {
    name:"frameTextViewer",
    props:{
        animations:{
            required:true,
        }
    },
    methods:{
        genearteTextFromMovements(m){
            if(m){
                return genearteTextFromMovements(m);
            }else{
                return null;
            }
            
        }
    }
}
</script>


<style lang="scss" scoped>
.frames{
    padding:0 0;

    height: initial;
    overflow-y: scroll;
    overflow-x: hidden;;
    .each-frame{
        
        border:2px solid black;
        border-radius: 5px;
        padding:1em;
        background: #f5f2f0;
        margin-bottom: 1em;
        .filename{
            margin: .25em;
            text-align: center;
            font-weight: bold;
        }
        .angles{
            white-space: break-spaces;
            text-align: left;
            font-family: Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace;
            width:100%;
            max-height: 20em;
            overflow: auto;
        }
    
    }

}
</style>