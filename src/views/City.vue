<template>
    <div class="city">
        <div class="search_wrap">
            <div class="search">
                <i class="fa fa-search"></i>
                <input v-model="city_val" type="text" placeholder="请输入城市">
            </div>
            <button @click="$router.push({name: 'address',params: {city: city}})">取消</button>
        </div>
        <div style="height:100vh" v-if="selectList.length == 0">
            <div class="location">
                <Location @click="selectCity({name:city})" :address="city"></Location>
            </div>
            <Alphabet @selectCity="selectCity" ref="allscroll" :cityInfo="cityInfo" :keys="keys"></Alphabet>
        </div>
        <div class="search_list">
            <ul>
                <li v-for="(item, index) in selectList" :key="index" @click="selectCity(item)">
                    {{item.name}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import Location from '../components/Location'
    import Alphabet from "../components/Alphabet"

    export default {
        name: "City",
        data(){
            return{
                city_val:'',
                cityInfo: null,
                keys: [],
                allCity: [],
                selectList: [],
            }
        },
        watch: {
            city_val(){
                this.searchCity();
            }
        },
        computed: {
            city() {
                return this.$store.getters.location.addressComponent.city || this.$store.getters.location.addressComponent.province;
            },
        },
        created(){
            this.getCityInfo();
        },
        methods: {
            //搜索城市显示相关
            searchCity(){
                if(!this.city_val){
                    // 如果搜索框为空, 数组置空
                    this.selectList = [];
                }else {
                    // 根据输入框的关键字检索城市 并存入到searchList数组中
                    this.selectList = this.allCity.filter(item => {
                        return item.name.indexOf(this.city_val) != -1;

                    })
                }
                // console.log(this.selectList);
            },
            //获取所有城市相关信息
            getCityInfo(){
                this.$axios("/api/posts/cities")
                    .then(res => {
                        this.cityInfo = res.data;
                        // console.log(this.cityInfo);
                        //获取key 计算key
                        this.keys = Object.keys(res.data);
                        // 去除hotcities这个key
                        this.keys.pop();
                        this.keys.sort();
                          // console.log(this.keys);
                        this.$nextTick(() => {
                            this.$refs.allscroll.initScroll();
                        })
                        //获取所有城市名 用来搜索过滤
                        this.keys.forEach(key => {
                            // console.log(this.cityInfo[key]);
                            this.cityInfo[key].forEach( city => {
                                // console.log(city);
                                this.allCity.push(city);
                            });
                        })
                        // console.log(this.allCity);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            selectCity(city){
                // console.log(city);
                this.$router.push({name:'address',params:{city: city.name}});
            }
        },
        components: {
            Location,
            Alphabet
        }
    }
</script>

<style scoped>
    .city {
        width: 100%;
        height: 100%;
        overflow: auto;
        box-sizing: border-box;
        padding-top: 45px;
    }
    .search_wrap {
        position: fixed;
        top: 0;
        height: 45px;
        width: 100%;
        background: #fff;
        box-sizing: border-box;
        padding: 3px 16px;
        display: flex;
        justify-content: space-between;
    }
    .search {
        background-color: #eee;
        border-radius: 10px;
        line-height: 40px;
        width: 85%;
        box-sizing: border-box;
        padding: 0 16px;
    }
    .search input {
        background: #eee;
        outline: none;
        border: none;
        margin-left: 5px;
    }
    .search_wrap button {
        outline: none;
        color: #009eef;
    }

    .location {
        background: #fff;
        padding: 8px 16px;
        height: 65px;
        box-sizing: border-box;
    }

    .search_list {
        background: #fff;
        padding: 5px 16px;
    }
    .search_list li {
        padding: 10px;
        border-bottom: 1px solid #eee;
    }
</style>
