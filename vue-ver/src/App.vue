<template>
  <div id="app">
    <h1
      v-bind:style="{
      gridColumnStart: 1,
      gridColumnEnd:4,
      gridRowStart:1,
      gridRowEnd:2,
      }"
    >{{ msg }}</h1>

    <!-- Top componetn of this app -->
    <!-- 
      COMMON RULES OF THIS PROJECT
      - layout and shape is defined in inline style 
    -->
    <AnimationContainer
      v-bind:style="{
      gridColumnStart: 1,
      gridColumnEnd:4,
      gridRowStart:2,
      gridRowEnd:3,
      }"
    ></AnimationContainer>
  </div>
</template>

<script>
import AnimationContainer from './components/AnimationContainer'
export default {
  name: 'app',
  components:{
    AnimationContainer
  },
  data () {
    return {
      msg: 'Animator : FBX storyboard to create robot animation'
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#app{
  display:grid;
  grid-template-rows: 1r 4fr 1fr;
  grid-template-columns: repeat(3, 1fr);
  h1{

  }

  AnimationContainer{
    grid-column-start: 1;
    grid-column-end: 4;
    grid-row-start: 2;
    grid-row-end: 3;
  }
}
</style>
