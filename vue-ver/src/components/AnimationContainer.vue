<template>
    <div class='animation-container'>
        <div class='storyboard-control-board'>
            <button v-on:click="pushScreen">+</button>
            <button v-on:click="popScreen">-</button>
        </div>
        <div class="storyboard">
            <ul :style="[positionAndSize]">
                <screen
                    v-for="film in animations"
                    v-bind:key="film.id"
                    v-bind:source="film"
                    @connect="connect"
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
        <arrowModal v-if="showModal" @close="getTransitionCondition"></arrowModal>
    </div>
</template>



<script>
import screen from './AnimationContainer/AnimationScreen'
import arrow from './AnimationContainer/Arrow'
import arrowModal from './AnimationContainer/ArrowModal'



export default {
    name:'AnimationContainer',
    components:{
        screen,
        arrow,
        arrowModal
    },
    data(){
        return{
            animations:[],
            connections:{},
            connectionState: false,
            connectionReadyScreenNumber: null,
            transitionCondition:{},
            showModal:false,
        }
    },
    computed:{
        positionAndSize:function(){
            const distance = this.calculateRadius(this.animations.length)
            const height = this.calculateRadius(this.animations.length, 2)
            return{
                marginTop: distance,
                marginLeft: distance,
                width:height,
                height:height,
            }
        }
    },
    methods:{
        calculateRadius:function(numOfItem, factor=1){
            return factor*Math.sqrt(numOfItem)*8+"em"
        },
        calculateAngle:function(idx, totalNumOfItem){
            const startAngle = -90
            const type = 1 // circle type -> 1: whole, 0.5 :half, 0.25 : quarter
            const angle = 360*type/totalNumOfItem
            return angle*idx+startAngle
        },

        pushScreen:function(){
            //add screen
            this.animations.push({
                id:this.animations.length,
                filename:"./src/assets/Samba Dancing.fbx",
                rotateRadius: this.calculateRadius(this.animations.length+1), // becuase item will be pushed
                rotateAngle: this.calculateAngle(this.animations.length-1, this.animations.length),
                rotateReverseAngle: -1*this.calculateAngle(this.animations.length-1, this.animations.length),
            })


            //re calculate tpositions of screen items
            for(let i=0; i<this.animations.length; i++){
                const a = this.calculateAngle(i,this.animations.length)
                this.animations[i].rotateRadius = this.calculateRadius(this.animations.length)
                this.animations[i].rotateAngle = a
                this.animations[i].rotateReverseAngle = -1*a
            }
            return this.animations.length
        },
        popScreen:function(){
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
        connect:function(messageFromChild){
            let screenIdNumber = messageFromChild
            if(!this.connectionState){
                this.connectionReadyScreenNumber = screenIdNumber
                this.connectionState = true
                this.showModal = true
            }else if(this.connectionReadyScreenNumber < this.animations.length){
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
            let key = messageFromChild[0]+"-"+messageFromChild[1]
            this.$delete(this.connections, key)
        },
        getTransitionCondition:function(messageFromChild){
            this.transitionCondition = messageFromChild
            this.showModal = false
        },
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
    display: grid;
    grid-template-columns: repeat(3,1fr);
    grid-template-rows: 1fr 4fr;

    .storyboard-control-board{
        grid-column-start: 1;
        grid-column-end: 4;
        grid-row-start: 1;
        grid-row-end:2;
    }
    .storyboard{
        grid-column-start: 1;
        grid-column-end: 4;
        grid-row-start: 2;
        grid-row-end: 3;
    }
}
</style>