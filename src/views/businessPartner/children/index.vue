<template>
  <div class="index">
    <NavBar :title="title"></NavBar>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import { apiClass, nativeFunction, getUserinfo } from "@/utils/index";
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
        apiClass.userinfo("businessPartner");
        // this.$router.push({
        //     path: '/businessPartner/businessPartnerType',
        //     query: {
        //         // status: this.status
        //     }
        // })
        
    },
    methods: {
        getUser(e) {
            console.log(e.detail);
            let type = e.detail.type;
            if(type == "businessPartner"){
                this.$router.push({
                    path: '/businessPartner/businessPartnerType'
                })
            }
        },

        
    }
}
</script>
<style scoped lang="less">
.index{
    background: #ffffff;
}
</style>
