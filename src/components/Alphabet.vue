<template>
    <div class="alphabet" ref="alphabet_scroll" v-if="cityInfo">
        <div class="scroll_wrap">
            <!--热门城市-->
            <div class="hot_wrap citylist">
                <div class="title">热门城市</div>
                <ul class="hot_city">
                    <li @click="$emit('selectCity',item)" v-for="(item,index) in cityInfo.hotCities" :key="index">
                        {{item.name}}
                    </li>
                </ul>
            </div>
            <!--所有城市-->
            <div class="city_wrap">
                <div class="city_content citylist" v-for="(item, index) in keys" :key="index">
                    <div class="title">{{item}}</div>
                    <ul>
                        <li @click="$emit('selectCity',city)" v-for="(city, index) in cityInfo[item]" :key="index">
                            {{city.name}}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="alphabet_keys">
            <ul>
                <li @click="selectCity(0)">#</li>
                <li @click="selectCity(index+1)" v-for="(item, index) in keys" :key="index">
                    {{item}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'
    export default {
        name: "Alphabet",
        props: {
            cityInfo: Object,
            keys: Array
        },
        data(){
            return{
                scroll: ""
            }
        },
        methods: {
            initScroll(){
                this.scroll = new BScroll(this.$refs.alphabet_scroll, {
                    click: true
                })
            },
            selectCity(index){

                const citylist = document.getElementsByClassName('citylist');
                // console.log(citylist);
                // 根据下标,滚动到相对应的元 素上
                let el = citylist[index];
                // 滚动到对应的位置上
                this.scroll.scrollToElement(el, 250);
            }
        }

    }
</script>

<style scoped>
    .alphabet {
        margin-top: 10px;
        box-sizing: border-box;
        padding: 0 16px;
        background: #fff;
        height: calc(100% - 65px);
        overflow: hidden;
    }
    .scroll_wrap {
        background: #fff;
        overflow: auto;
        padding-bottom: 100px;
    }
    .title {
        color: #aaa;
        padding: 15px 0;
    }
    .hot_city {
        padding: 0 16px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .hot_city li {
        width: 30%;
        background: #f1f1f1;
        margin: 0 10px 10px 0;
        text-align: center;
        padding: 10px;
        box-sizing: border-box;
    }
    .city_content li {
        padding: 10px;
        border-bottom: 1px solid #eee;
    }
    .alphabet_keys {
        position: fixed;
        right: 0;
        top: 25%;
        color: #aaa;
        font-size: 12px;
        line-height: 1.4;
        text-align: center;
        padding: 0 5px;
    }
</style>
