

<template>
    <div class='animation-container'>
        <div class="storyboard"
            v-bind:style="{        
                gridColumnStart : 1,
                gridColumnEnd : 3,
                gridRowStart : 1,
                gridRowEnd : 4,
            }"
        >
            <ul :style="[positionAndSize]">
                <screen
                    v-for="film in animations"
                    v-bind:key="film.id"
                    v-bind:source="film"
                    @connect="connect"
                    @registerMovement="registerMovement"
                >
                </screen>
            </ul>
            <arrow
                v-for="(value,key) in connections"
                v-bind:key="key"
                v-bind:from="value.from"
                v-bind:to="value.to"
                v-bind:transitionCondition="value.transitionCondition"
                @disconnect="disconnect"
            >
            </arrow>
        </div>
        <div class="storyboard-control-board"
            v-bind:style="{
                gridColumnStart :3,
                gridColumnEnd:5,
                gridRowStart:1,
                gridRowEnd:2,
            }"
        >
            <input id="upload-file" type="file" accept=".fbx" title=" Select File(FBX only) " v-on:change="pushScreen($event)"/>
            <button class="btn"  v-on:click="popScreen">-</button>
            <button  class="btn" v-on:click="generateCode">generate</button>
            <button class="btn" v-on:click="save">Save</button>
        </div>
        <codeBox 
            v-bind:animations="animations"
            v-bind:style="{
                gridColumnStart:3,
                gridColumnEnd:5,
                gridRowStart:2,
                gridRowEnd:4
            }"
            v-bind:code="code"
        ></codeBox>
        <arrowModal v-if="showModal" v-bind:bones="transitionBones" @close="getTransitionCondition"></arrowModal>
    </div>
</template>



<script>
import { genearteTextFromMovements } from '../logic/AnimationExtractor'
import screen from './AnimationContainer/AnimationScreen'       // FBX viewers
import arrow from './AnimationContainer/Arrow'                  // Drawing arrow components
import arrowModal from './AnimationContainer/ArrowModal'        // To select options to draw arrows
import codeBox from './AnimationContainer/CodeBox'              // textbox where the generated arduino code is displayed
import JSzip from 'jszip';
import { saveAs } from 'file-saver';
import {templateCode} from './../assets/templateCode'

export default {
    name:'AnimationContainer',
    components:{
        screen,
        arrow,
        arrowModal,
        codeBox
    },
    data(){
        return{
            animations:[],                      // data for 'screen' components
                                                // {id:, filename:, rotateRadius:, rotateAngle:, rotateReverseAngle, movement}
                                                // rotateRadius, rotateAngle, rotateReveseAngle are position informations of screen for circular layout

            connections:{},                     // data for 'arrow' components
            connectionState: false,             // boolean state whether the state is ready to connect the arrow to the end node(screen)
            connectionReadyScreenNumber: null,  // the node id number to start arrow
            transitionBones:null,               // bones list to deliver to arrowModal
            transitionCondition:{},             // information that arrow has to change the state in FSM of FBX storyboard
            showModal:false,                    // boolean state to show the modal
            code:``,
        }
    },
    computed:{
        positionAndSize:function(){
            const distance = this.calculateRadius(this.animations.length)
            const height = this.calculateRadius(this.animations.length, 2)
            return{
                marginTop: distance,
                width:height,
                height:height,
            }
        }
    },
    methods:{
        calculateRadius:function(numOfItem, factor=1){
            // function to calculate the proper radius of circular layout for FBX screens
            return factor*Math.sqrt(numOfItem)*8+"em"
        },
        calculateAngle:function(idx, totalNumOfItem){
            // function to calculate proper angles for FBX screens

            const startAngle = -90
            const type = 1 // circle type -> 1: whole, 0.5 :half, 0.25 : quarter
            const angle = 360*type/totalNumOfItem
            return angle*idx+startAngle
        },

        pushScreen:function(event){
            // event handler - when user push the button to add new FBX screen
            const file = event.target.files[0]
            //add screen
            this.animations.push({
                id:this.animations.length,
                file : file,
                rotateRadius: this.calculateRadius(this.animations.length+1), // becuase item will be pushed
                rotateAngle: this.calculateAngle(this.animations.length-1, this.animations.length),
                rotateReverseAngle: -1*this.calculateAngle(this.animations.length-1, this.animations.length),
                movement:null,
            })

            console.log(this.animations)
            //re calculate tpositions of screen items
            for(let i=0; i<this.animations.length; i++){
                const a = this.calculateAngle(i,this.animations.length)
                this.animations[i].rotateRadius = this.calculateRadius(this.animations.length)
                this.animations[i].rotateAngle = a
                this.animations[i].rotateReverseAngle = -1*a
            }
            event.target.value = ""
            return this.animations.length
        },
        popScreen:function(){
            // event handler - when user delete the last FBX screen

            const val = this.animations.pop()
            const deletedId = val.id
            //re calculate positions of screen items
            for(let i=0; i<this.animations.length; i++){
                const a = this.calculateAngle(i,this.animations.length)
                this.animations[i].rotateRadius = this.calculateRadius(this.animations.length)
                this.animations[i].rotateAngle = a
                this.animations[i].rotateReverseAngle = -1*a
            }
            for (const key in this.connections) {
                let start = Number(key.split("-")[0])
                let end = Number(key.split("-")[1])
                if(start === Number(deletedId) || end === Number(deletedId)){
                    this.$delete(this.connections, key)
                }
            }
            return val
        },
        generateCode:function(){
            // event handler - when user generate code from Animation State
            this.code = templateCode
            
        },
        connect:function(messageFromChild){
            // event handler - when user push the 'connect' button in 'screen' control-board


            let screenIdNumber = messageFromChild
            if(!this.connectionState){
                // set start node for drawing arrow

                this.connectionReadyScreenNumber = screenIdNumber
                this.connectionState = true
                this.transitionBones = this.animations[screenIdNumber].movement[0]
                this.showModal = true
            }else if(this.connectionReadyScreenNumber < this.animations.length){
                // set destination node for drawing arrow

                let from = this.connectionReadyScreenNumber
                let to = screenIdNumber
                
                //draw arrow
                this.$set(this.connections, from+"-"+to, {from:from, to:to, transitionCondition:this.transitionCondition})
                console.log(this.connections)
                this.connectionState = false
                this.connectionReadyScreenNumber = null
                this.transitionCondition = null
                this.showModal = false
            }else{
                // what if user delete last node after select it as connectionNode
                this.connectionState = false
                this.connectionReadyScreenNumber = null 
            }
        },
        disconnect:function(messageFromChild){
            // event handler - when user delete the arrow

            let key = messageFromChild[0]+"-"+messageFromChild[1]
            this.$delete(this.connections, key)
        },
        getTransitionCondition:function(messageFromChild){
            // event handler - when user inputs the transition information via modal

            this.transitionCondition = messageFromChild
            this.showModal = false
        },
        registerMovement:function(messageFromChild){
            let screenId, movement;
            [screenId, movement] = messageFromChild
            this.animations[screenId].movement = movement
        },
        save:function(){
            let fileAndAnimations = this.animations.map(m=>{return [m.file.name, genearteTextFromMovements(m.movement)]})
            let zip = new JSzip();
            let animationFolder = zip.folder("animations");
            fileAndAnimations.forEach(element => {
                animationFolder.file(element[0]+".txt", element[1])
            });
            zip.file("code.cpp",this.code);
            zip.generateAsync({type:"blob"}).then(function(content) {
                // see FileSaver.js
                saveAs(content, "animations.zip");
            });
        }
    }


}
</script>

<style lang="scss" scoped>
.animation-container{
    width:100%;
    height:100%;
    ul{
        list-style-type: none;
        margin:0;

    }
    height: 70vh;
    display: grid;
    grid-template-columns: repeat(4,1fr);
    grid-template-rows: 1fr 1fr 10fr;
    grid-row-gap: 1em;
    grid-column-gap: 1em;

    .storyboard-control-board{
        background-color: #f5f2f0;
        border:2px solid black;
        border-radius: 5px;
        padding:1em;
        .input{
            float:left;
        }
        .btn{
            float: right;
            margin-right: .5em;
            font-size: 1.3em;
            padding:.5em 1em;
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
    }
    .storyboard{
        margin-left: auto;
        margin-right: auto;
        width:10%;
    }
}
</style>
