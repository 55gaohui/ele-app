<template>
    <div :class="{'open' : isSort || isScreen}" @click.self="hideView">
        <!--排序及筛选导航-->
        <div v-if="filterData" class="filter_wrap">
            <aside class="filter">
                <div v-for="(item,index) in filterData.navTab" :class="{'filter-bold' : currentFilter == index}" class="filter-nav" @click="filterSort(index)">
                    <span>{{item.name}}</span>
                    <i v-if="item.icon" :class="'fa fa-'+item.icon"></i>
                </div>
            </aside>
        </div>
        <!--排序-->
        <section class="filter-extend" v-if="isSort">
            <ul>
                <li v-for="(item,index) in filterData.sortBy" :key="index" @click="selectSort(item,index)">
                    <span :class="{'selectName' : currentSort == index}">{{item.name}}</span>
                    <i class="fa fa-check" v-show="currentSort === index"></i>
                </li>
            </ul>
        </section>
        <!--排序-->
        <section class="filter-extend" v-if="isScreen">
            <div class="filter-sort">
                <div v-for="(screen, index) in filterData.screenBy" :key="index" class="morefilter">
                    <p class="title">{{screen.title}}</p>
                    <ul>
                        <li v-for="(item, i) in screen.data" :key="i" :class="{'selected': item.select}" @click="selectScreen(item,screen)">
                            <img v-if="item.icon" :src="item.icon" alt="" />
                            <span>{{item.name}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="morefilter-btn">
                <span class="morefilter-clear" :class="{'edit': edit}" @click="clearFilter">清空</span>
                <span class="morefilter-ok" @click="filterOk">确定</span>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        name: "FilterView",
        data(){
            return{
                currentFilter : 0,  //导航选中的序号
                isSort: false,  //排序
                currentSort: 0,   //排序 选中的序号
                isScreen: false  //筛选
            }
        },
        props: {
            filterData : Object
        },
        computed: {
            edit(){
                let edit = false;
                console.log(this.filterData.screenBy);
                this.filterData.screenBy.forEach(screen => {
                    screen.data.forEach(item => {
                        if(item.select){
                            edit = true;
                        }
                    })

                })
                return edit;
            }
        },
        methods: {
            //点击 综合排序
            filterSort(index){
                this.currentFilter = index;
                switch (index) {
                    case 0 :
                        this.isScreen = false;
                        this.isSort = true;
                        //搜索框置顶
                        this.$emit('searchFixed', true);
                        break;
                    case 1:
                        this.$emit('update', {condition: this.filterData.navTab[1].condition});
                        this.hideView();
                        break;
                    case 2:
                        this.$emit('update', {condition: this.filterData.navTab[2].condition});
                        this.hideView();
                        break;
                    case 3:
                        this.isScreen = true;
                        this.isSort = false;
                        //搜索框置顶
                        this.$emit('searchFixed', true);
                        break;
                    default :
                        break;
                }
            },
            //隐藏综合排序遮罩层
            hideView(){
                this.isSort = false;
                this.isScreen = false;
                this.$emit('searchFixed', false);
                this.$emit('searchFixed', false);
            },
            //综合排序遮罩层 点击相关排序
            selectSort(item,index){
                this.currentSort = index;
                // console.log(item.name);
                this.filterData.navTab[0].name = item.name;
                this.hideView();

                // 更新数据
                this.$emit("update", { condition: item.code });
            },
            //选择筛选条件
            selectScreen(item,screen){
                // 如果是不是多选，就先重置当前列表内 为false
                if(screen.id !== "MPI"){
                    screen.data.forEach(ele =>{
                        ele.select = false;
                    })
                }
                item.select = !item.select;
            },
            //清除所有筛选条件
            clearFilter(){
                this.filterData.screenBy.forEach(screen => {
                    screen.data.forEach(item => {
                        item.select = false;
                    })

                })
            },
            filterOk(){
                let screenData= {
                    MPI: "",
                    offer: "",
                    per: ""
                };
                let mpiStr = '';
                this.filterData.screenBy.forEach(screen => {
                    screen.data.forEach(item => {
                        if(item.select){
                            // 两种情况 1.多选 2.单选
                            if(screen.id !== "MPI"){
                                //单选
                                console.log('单选');
                                screenData[screen.id] = item.code;
                            }else {
                                //多选
                                console.log('多选');
                                mpiStr += item.code + ',';
                                screenData[screen.id] = mpiStr;
                            }
                        }
                    })
                })
                // console.log(screenData);
                this.$emit('update',{ condition: screenData });
                this.hideView();
            }
        }
    }
</script>

<style scoped>
    .filter_wrap {
        background: #fff;
        position: sticky;
        top: 54px;
        z-index: 10;
    }
    .filter {
        position: relative;
        border-bottom: 1px solid #ddd;
        line-height: 10.4vw;
        z-index: 101;
        height: 10.666667vw;
        display: flex;
        justify-content: space-around;
    }
    .filter-nav {
        flex: 1;
        text-align: center;
        color: #666;
        font-size: 0.8333rem;
    }
    .filter-nav i {
        width: 1.6vw;
        height: 0.8vw;
        margin-left: 1.333333vw;
        margin-bottom: 0.533333vw;
        fill: #333;
        will-change: transform;
    }

    .filter-bold {
        font-weight: 600;
        color: #333;
    }

    .open {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        transition: all 0.3s ease-in-out;
        z-index: 3;
    }

    .filter-extend {
        background-color: #fff;
        color: #333;
        padding-top: 2.133333vw;
        position: absolute;
        width: 100%;
        z-index: 4;
        left: 0;
        top: 24.533333vw;
    }
    .filter-extend li {
        position: relative;
        padding-left: 5.333333vw;
        line-height: 10.666667vw;
        overflow: hidden;
    }
    .fa-check {
        float: right;
        color: #009eef;
        margin-right: 3.733333vw;
        line-height: 10.666667vw;
    }

    .selectName {
        color: #009eef;
    }
    /* 筛选 */
    .filter-sort {
        background: #fff;
        padding: 0 2.666667vw;
        line-height: normal;
    }
    .morefilter {
        margin: 2.666667vw 0;
        overflow: hidden;
    }
    .morefilter .title {
        margin-bottom: 2vw;
        color: #666;
        font-size: 0.5rem;
    }
    .morefilter ul {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        font-size: 0.8rem;
    }
    .morefilter li {
        box-sizing: border-box;
        width: 30%;
        height: 9.333333vw;
        line-height: 9.333333vw;
        margin: 0.8vw 1%;
        background: #fafafa;
    }
    .morefilter li img {
        width: 3.466667vw;
        height: 3.466667vw;
        vertical-align: middle;
        margin-right: 0.8vw;
    }
    .morefilter li span {
        margin-left: 2%;
        vertical-align: middle;
    }

    .morefilter-btn {
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: #fafafa;
        box-shadow: 0 -0.266667vw 0.533333vw 0 #ededed;
        line-height: 11.466667vw;
        box-sizing: border-box;
    }
    .morefilter-btn span {
        font-size: 0.826667rem;
        text-align: center;
        text-decoration: none;
        flex: 1;
    }
    .morefilter-clear {
        color: #ddd;
        background: #fff;
    }
    .morefilter-ok {
        color: #fff;
        background: #00d762;
        border: 0.133333vw solid #00d762;
    }

    .selected {
        color: #3190e8 !important;
        background-color: #edf5ff !important;
    }

    .edit {
        color: #333 !important;
    }
</style>
