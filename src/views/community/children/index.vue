<template>
  <div class="index">
    <NavBar :title="title"></NavBar>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import { apiClass, nativeFunction } from "@/utils/index";
import { getBusinessSettledInfo } from '@/api/index';
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
        document.body.addEventListener('getUser',this.getUser);
        // apiClass.userinfo("business");
        this.$router.push({
            path: '/community/communityStatus',
            query: {
                // status: this.status
            }
        })
    },
    methods: {
        getUser(e) {
            console.log(e.detail);
            let type = e.detail.type;
            if(type == "community"){

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
                            path: '/business/businessType',
                            query: {}
                        })
                    }else{
                        this.$router.push({
                            path: '/business/businessStatus',
                            query: {
                                status: this.status,
                                id: data.classificationTypeId
                            }
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
