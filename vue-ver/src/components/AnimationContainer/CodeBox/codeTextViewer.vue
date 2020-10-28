<template>
    <div class="code">
        <vue-code-highlight language="clike">
            <pre>{{code}}</pre>
        </vue-code-highlight>
    </div>
</template>

<script>
import { component as VueCodeHighlight } from 'vue-code-highlight';

export default {
    name:"CodeTextViewer",
    props:{
        code:{
            type:String,
            required:true,
        }
    },
    components:{
        VueCodeHighlight,
    }
}
</script>

<style lang="scss">
@import "./../../../assets/css/code_themes/prism.css";
.code{
    pre{
        margin:0 0;
    }
    overflow:scroll;
    text-align: left;
     background-color: #f5f2f0;
    border:2px solid black;
    border-radius: 5px;
    padding: 0 0;
}
</style>