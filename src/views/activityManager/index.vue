<template>
  <!-- <transition :name="transitionName"> -->
    <router-view></router-view>
  <!-- </transition> -->
</template>
<script>
import { getUserinfo, getValueFromApp } from "@/utils/index";
export default {
  data() {
    return {
      transitionName: "",
    };
  },
  watch: {
    $route(to, from) {
      // console.log(to.meta.index);
      // console.log(from.meta.index);

      const toIndex = to.meta.index;
      const fromIndex = from.meta.index;

      if((toIndex == 2 && fromIndex == 7) || (toIndex == 7 && fromIndex == 2)){
        this.transitionName = toIndex < fromIndex ? "slide-left" : "slide-right";
      }else{
        this.transitionName = toIndex < fromIndex ? "slide-left" : "slide-right";
      }
      
    },
  },
  mounted() {
    window.getUserinfo = getUserinfo;
    window.getValueFromApp = getValueFromApp;
  }
};
</script>
<style scoped lang="less">
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  height: 100%;
  top: 0px;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}
.slide-left-enter {
  transform: translate3d(-100%, 0, 0);
}
.slide-left-leave-active {
  transform: translate3d(100%, 0, 0);
}
.slide-right-enter {
  transform: translate3d(100%, 0, 0);
}
.slide-right-leave-active {
  transform: translate3d(-100%, 0, 0);
}
</style>
