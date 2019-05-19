<template>
    <div class="Rating-gray">
        <i v-for="(item,index) in itemClasses" :key="index" class="fa" :class="item"></i>
    </div>
</template>

<script>
    const LENGTH = 5;
    const CLS_ON = 'fa-star';
    const CLS_HALF = 'fa-star-half-empty';
    const CLS_OFF = 'fa-star-o';
    export default {
        name: "Rating",
        props: {
            rating: Number
        },
        computed: {
            itemClasses(){
                //存放计算星星的结果
                let result = [];
                // 对分数进行处理, 向下取0.5的倍数
                let score = Math.floor(this.rating * 2)/2;
                //判断是否有0.5
                let hasDecimal = score % 1 !== 0;
                //向下取整，获取全星个数
                let integer = Math.floor(score);
                //循环全星的个数，往result添加相应的全星
                for(let i=0; i < integer; i++){
                    result.push(CLS_ON);
                }
                // 判断是否有小数，有则添加一个半星
                if(hasDecimal){
                    result.push(CLS_HALF);
                }
                // 判断是否全星和半星个数 是否小于总星5星，如果小于则继续添加空星
                while (result.length < LENGTH){
                    result.push(CLS_OFF);
                }
                return result;

            }
        }
    }
</script>

<style scoped>
    .Rating-gray {
        margin-right: 1.066667vw;
        color: #ffbe00;
        display: inline-block;
    }
</style>