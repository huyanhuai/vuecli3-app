<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" class="router"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" class="router"></router-view>
    
  </div>
</template>

<script>
// console.log(process.env.NODE_ENV);
export default {
  name: "app",
  created() {
    // this.$axios.get("/category/all").then(res => {
    //   console.log(res);
    // });
  }
};
</script>
<style lang="less">
.router{
  width: 100%;
  height: 100%;
  height: 100vh;
  overflow: scroll;
  position: fixed;
  overflow: hidden !important;
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #F5F6FA;
}
</style>


