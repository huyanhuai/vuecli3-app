<template>
  <div class="nav-bar" v-bind:class="{'nav-bar_border': border}">
    <div class="nav-bar-back" @click="back">
        <img src="../assets/img/back@3x.png" alt="">
    </div>
    <div class="nav-bar-title">{{title}}</div>
  </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            // required: true
        },
        border: {
          type: Boolean
        }
    },
    data () {
        return {
        }
    },
    mounted () {
        let navH = document.getElementsByClassName("nav-bar")[0].offsetHeight;
        this.$store.commit('updateNavH',navH);
        // console.log(this.$store.state.navH)
    },
    methods: {
      back(){
         this.$router.go(-1);
      }
    }
};
</script>

<style lang="less" scoped>
.nav-bar_border{
  box-shadow: 0px 1px 0px 0px #D8D8D8;
}
.nav-bar {
  padding-right: 40px;
  width: 100%;
  height: 44px;
  line-height: 44px;
  background: #FFFFFF;
  
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;  
  .nav-bar-back{
    width: 40px;
    display: flex;
    align-items: center;
    padding-left: 15px;
    img{
        width: 9px;
    }
  }
  .nav-bar-title{
      flex: 1;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
  }
}
</style>