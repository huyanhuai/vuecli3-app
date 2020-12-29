<template>
  <div class="index">
    <NavBar :title="title"></NavBar>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import { getUserinfo, getValueFromApp, apiClass } from "@/utils/index";
export default {
    name: 'index',
    components: {
        NavBar
    },
    data () {
        return {
            title: '',
            status: ''
        }
    },
    created () {

    },
    mounted () {
        window.getUserinfo = getUserinfo;
        document.body.addEventListener('getUser',this.getUser);
        // apiClass.userinfo("activityManager");
        this.$router.push({
            path: '/activityManager/activityManager'
        })
    },
    methods: {
        getUser(e) {
            console.log(e.detail);
            let type = e.detail.type;
            if(type == "activityManager"){
                this.$router.push({
                    path: '/activityManager/activityManager'
                })
            }
        }
    }
}
</script>
<style scoped lang="less">
.index{
    background: #ffffff;
}
</style>
