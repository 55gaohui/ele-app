<template>
    <div class="home">
        <div class="header">
            <div class="address_map" @click="$router.push({name:'address', params: {city:city,province: province}})">
                <i class="fa fa-map-marker"></i>
                <span>{{address}}</span>
                <i class="fa fa-sort-desc"></i>
            </div>
        </div>
        <div class="search_wrap" :class="{'fixedview' : showFilter}" @click="$router.push('/search')">
            <div class="shop_search" >
                <i class="fa fa-search"></i>
                搜索商家 商家名称
            </div>
        </div>
        <div id="container">
            <!--banner-->
            <mt-swipe :auto="4000" class="swiper">
                <mt-swipe-item v-for="(img, index) in swipeImgs" :key="index">
                    <img :src="img" alt="">
                </mt-swipe-item>
            </mt-swipe>
            <!--分类-->
            <mt-swipe :auto="0" class="entries">
                <mt-swipe-item v-for="(entry, i) in entries" :key="i">
                    <div class="foodentry" v-for="(item, index) in entry" :key="index">
                        <div class="img_wrap">
                            <img :src="item.image" alt>
                        </div>
                        <span>{{item.name}}</span>
                    </div>
                </mt-swipe-item>
            </mt-swipe>
        </div>

        <!-- 推荐商家 -->
        <div class="shoplist-title">推荐商家</div>

        <!-- 导航 -->
        <FilterView :filterData="filterData" @searchFixed="searchFixed" @update="update"></FilterView>

        <!-- 商家信息 -->
        <mt-loadmore
                :top-method="loadData"
                :bottom-method="loadMore"
                :auto-fill="false"
                :bottom-all-loaded="allLoaded"
                :bottomPullText="bottomPullText"
                ref="loadmore">
            <div class="shoplist">
                <IndexShop v-for="(item, index) in restaurants" :key="index" :restaurant="item.restaurant"></IndexShop>
            </div>
        </mt-loadmore>

    </div>
</template>

<script>
    import { Swipe, SwipeItem,Loadmore } from 'mint-ui';
    import FilterView from "../components/FilterView"
    import IndexShop from "../components/IndexShop"

    export default {
        name: "home",
        data(){
            return{
                swipeImgs: [],
                entries:[],
                filterData: null,
                showFilter: false,
                page: 1,         //获取商家页码
                size: 5,           //获取商家个数
                restaurants: [],   //存放商家列表的容器
                bottomPullText: "上拉加载更多",
                allLoaded: false,
                data: null

            }
        },
        computed:{
            address(){
                return this.$store.getters.address;
            },
            location(){
                return this.$store.getters.location;
            },
            city() {
                return this.$store.getters.location.addressComponent.city || this.$store.getters.location.addressComponent.province;
            },
            province() {
                return this.$store.getters.location.addressComponent.province;
            }
        },
        created() {
            this.getData();
        },
        methods: {
            getData(){
                this.$axios("/api/profile/shopping").then(res => {
                    // console.log(res.data);
                    //获取banner图
                    this.swipeImgs = res.data.swipeImgs;
                    //获取分类信息
                    this.entries = res.data.entries;
                })
                //获取筛选信息
                this.$axios("/api/profile/filter").then(res => {
                    // console.log(res.data);
                    this.filterData = res.data;
                })
                this.loadData();
            },
            loadData(){
                this.page= 1;
                this.allLoaded = false;
                this.bottomPullText= "上拉加载更多";
                //获取商家信息  这里使用post是要实现上拉加载
                this.$axios.post(`/api/profile/restaurants/${this.page}/${this.size}`,this.data).then((res) => {
                    this.$refs.loadmore.onTopLoaded(); //通知loadmore组件从新渲染，计算
                    this.restaurants = res.data;
                    // console.log(this.restaurants);
                })
            },
            loadMore(){
                if(!this.allLoaded){
                    this.page++;
                    this.$axios.post(`/api/profile/restaurants/${this.page}/${this.size}`,this.data).then((res) => {
                        this.$refs.loadmore.onBottomLoaded(); //通知loadmore组件从新渲染，计算
                        if(res.data.length > 0){
                            //吧获取数据放入restaurants里面
                            res.data.forEach(item =>{
                                this.restaurants.push(item);
                            })
                            console.log(this.restaurants);
                            //如果获取的数据小于每页的个数，则表示后面没有数据啦
                            if(res.data < this.size){
                                this.allLoaded = true;
                                this.bottomPullText = '没有更多了哦';
                            }
                        }else {
                            //数据为空
                            this.allLoaded = true;
                            this.bottomPullText = '没有更多了哦';
                        }

                    })
                }
            },
            searchFixed(isShow){
                this.showFilter = isShow;
            },
            //更新列表排序
            update(condition){
                this.data = condition;
                this.loadData();
            }
        },
        components: {
            FilterView,
            IndexShop
        }

    }
</script>

<style scoped>
    .home {
        width: 100%;
        height: 100%;
        overflow: auto;
        box-sizing: border-box;
    }
    .header,
    .search_wrap {
        background-color: #009eef;
        padding: 10px 16px;
    }
    .header .address_map {
        color: #fff;
        font-weight: bold;
    }
    .address_map i {
        margin: 0 3px;
        font-size: 18px;
    }
    .address_map span {
        display: inline-block;
        width: 80%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .search_wrap .shop_search {
        /* margin-top: 10px; */
        background-color: #fff;
        padding: 10px 0;
        border-radius: 4px;
        text-align: center;
        color: #aaa;
    }

    .search_wrap {
        position: sticky;
        top: 0px;
        z-index: 999;
        box-sizing: border-box;
    }
    .swiper {
        height: 100px;
    }
    .swiper img {
        width: 100%;
        height: 100px;
    }

    .entries {
        background: #fff;
        height: 47.2vw;
        text-align: center;
        overflow: hidden;
    }
    .foodentry {
        width: 20%;
        float: left;
        position: relative;
        margin-top: 2.933333vw;
    }
    .foodentry .img_wrap {
        position: relative;
        display: inline-block;
        width: 12vw;
        height: 12vw;
    }
    .img_wrap img {
        width: 100%;
        height: 100%;
    }
    .foodentry span {
        display: block;
        color: #666;
        font-size: 0.32rem;
    }
    /* 推荐商家 */
    .shoplist-title {
        display: flex;
        align-items: flex;
        justify-content: center;
        height: 9.6vw;
        line-height: 9.6vw;
        font-size: 16px;
        color: #333;
        background: #fff;
    }
    .shoplist-title:after,
    .shoplist-title:before {
        display: block;
        content: "一";
        width: 5.333333vw;
        height: 0.266667vw;
        color: #999;
    }
    .shoplist-title:before {
        margin-right: 3.466667vw;
    }
    .shoplist-title:after {
        margin-left: 3.466667vw;
    }

    .fixedview {
        width: 100%;
        position: fixed;
        top: 0px;
        z-index: 999;
    }

    .mint-loadmore {
        height: calc(100% - 95px) ;
        padding-bottom: 95px;
        overflow: auto;
    }
    .mint-loadmore-bottom{
        background: #f1f1f1;
    }
</style>
