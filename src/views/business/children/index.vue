<template>
  <div class="index">
    <NavBar :title="title"></NavBar>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import { apiClass, nativeFunction, getUserinfo } from "@/utils/index";
import { getBusinessSettledInfo } from '@/api/index';
import { Toast } from 'vant';
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
        apiClass.userinfo("business");
        // this.$router.push({
        //     path: '/business/businessType',
        //     query: {
        //         // status: this.status
        //     }
        // })
        // this.$store.commit('updateToken',localStorage.getItem('token'));
    },
    methods: {
        getUser(e) {
            console.log(e.detail);
            let type = e.detail.type; 
            if(type == "business"){
                this.getInfo();
            }
        },

        // 获取审核信息
        getInfo() {
            getBusinessSettledInfo()
            .then(res => {
                console.log(res);
                if(res.code == 200){
                    let data = res.data;
                    this.status = data.status;
                    this.$store.commit('updateBusinessSettledInfo',data);
                    if(data.examining){
                        this.$router.push({
                            path: '/business/businessStatus',
                            query: {
                                status: this.status,
                                id: data.classificationTypeId
                            }
                        })
                    }else{
                        this.$router.push({
                            path: '/business/businessType',
                            query: {}
                        })
                        
                    }
                }
            })
        }
    }
}
</script>
<style scoped lang="less">
.index{
    background: #ffffff;
}
</style>
