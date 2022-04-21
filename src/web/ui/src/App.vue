<template>
  <div id="main" class="layout">
    <Header/>
      <div class="content-wrapper container">
        <div class="page-content">
          <router-view/>
        </div>
      </div>
    <Footer/>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  components:{
    Header,Footer
  }
}

</script>



