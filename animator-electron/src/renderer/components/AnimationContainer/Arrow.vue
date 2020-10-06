<template>
    <connection  :from="'#screen-'+from" :to="'#screen-'+to" color="red" tail :width="3">
        <div class="line" 
        v-on:click="disconnect" 
        >
          <div class="description">
            <div 
              v-for="(value,key) in transitionCondition"
              v-bind:key="key"
            >
            {{key}} : {{value}}
            </div>
          </div>
        </div>
    </connection>
</template>

<script>
import * as Arrow from './domarrow'

export default {
    name:"Arrow",
    props:{
        from:{
            type:Number,
            required:true
        },
        to:{
            type:Number,
            required:true
        },
        transitionCondition:{
            type:Object
        }
    },
    methods:{
        disconnect(){
            this.$emit('disconnect',[this.from,this.to])
        },
        showTransitionCondition(){
            this.$emit('showTransitionCondition',[this.from,this.to] )
        }
    },
    mounted(){

    },
    updated(){

    }
}
</script>

<style lang="scss">
.line:hover .description{
  display: block;
}
connection{
    .line{
        .description{
          background-color: rgba($color: #000000, $alpha: 0.8);
          width: 50%;
          color: white;
          border-radius: 5px;
          margin-top:10px;
          margin-left: auto;
          margin-right: auto;
          padding: 0.5em;
          display: none;
        }


        cursor:pointer;
        position:absolute;
        height:20px;
        border-color: purple;
        background-color: red;
        .arrow{
            top: -5px;
            height: 0px;
            width: 0px;
            position: absolute;
            border-bottom: 6px solid transparent;
            border-top: 6px solid transparent;
            background-clip: border-box;
        }
        .arrow-fw{
            border-right: 12px solid black;
        }
        .arrow-bw{
            left: 100%;
            border-left: 12px solid black;
            transform: translateX(-12px);
        }
        .text{
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translate(-50%, -100%);
        }
    }
}

</style>