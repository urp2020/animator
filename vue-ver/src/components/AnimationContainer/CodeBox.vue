<template>
    <div class="code-box">
        <framesTextViewer
            v-bind:style="{
                gridColumnStart:1,
                gridColumnEnd:2,
                gridRowStart:1,
                gridRowEnd:2,
            }"
            v-bind:animations="animations"
        >
        </framesTextViewer>
        <codeTextViewer
            v-bind:style="{
                gridColumnStart:2,
                gridColumnEnd:3,
                gridRowStart:1,
                gridRowEnd:2
            }"
            v-bind:code="code"
        ></codeTextViewer>
    </div>
</template>

<script>
import codeTextViewer from './CodeBox/codeTextViewer'
import framesTextViewer from './CodeBox/frameTextViewer'


export default {
    name:"CodeBox",
    props:{
        animations:{
            required:true
        },
        code:{
            type:String,
            required:true
        }
    },
    components:{
        codeTextViewer,
        framesTextViewer
    },
    methods:{
        save(){
            let fileAndAnimation = this.animations.map( m => {return [m.file.name, genearteTextFromMovements(m.movement)]});
            
            console.log(this.animations)
        }
    }
}
</script>

<style lang="scss" scoped>
.code-box{
    display: grid;
    grid-column-gap: 1em;
    grid-template-columns: repeat(2,1fr);
    grid-template-rows: repeat(1,1fr);
    height:100%;
    overflow:hidden;

     .buttons{
         border:2px solid black;
        border-radius: 5px;
        padding:1em;
        background: #f5f2f0;
        margin-bottom: 1em;
     }
}
</style>