<template>
  <div class="container">
    <div class="main">
      <div class="row">
        <div class="col-4">
          <TestCard/>
        </div>
        <div class="col-8">
          sa
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TestCard from './components/TestCard.vue'

export default {
  name: 'App',
  components: {
    TestCard
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
