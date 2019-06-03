<template>
    <div class="shop">
        <nav class="header-">
            <div class="nav_bg">
                <img :src="" alt="">
            </div>
        </nav>
    </div>
</template>

<script>
    export default {
        name: "Shop",
        data(){
            return{
                shopInfo: null
            }
        },
        created() {
            this.getData();
        },
        methods: {
            getData(){
                this.$axios("/api/profile/batch_shop").then(res => {
                    this.shopInfo = res.data;
                });
            }
        }
    }
</script>

<style scoped>

</style>