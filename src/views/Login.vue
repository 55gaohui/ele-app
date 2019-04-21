<template>
    <div class="login">
        <div class="logo">
            <img src="../assets/logo.jpg" alt="my login image">
        </div>
        <!--手机号-->
        <inputGroup v-model="phone" type="number" name="" placeholder="手机号" @btnClick="getVrifyCode" :btnTitle="btnTitle" :disabled="disabled" :error="errors.phone"></inputGroup>
        <!--验证码-->
        <inputGroup v-model="verifyCode" type="number" name="" placeholder="验证码" :error="errors.code"></inputGroup>
        <!-- 用户服务协议 -->
        <div class="login_des">
            <p>
                新用户登录即自动注册，表示已同意
                <span>《用户服务协议》</span>
            </p>
        </div>
        <div class="login_btn">
            <button :disabled="isClick" @click="handleLogin">登录</button>
        </div>
    </div>
</template>

<script>
    import InputGroup from "../components/InputGroup";
    export default {
        name: "login",
        data() {
            return{
                phone:"",
                verifyCode:"",
                btnTitle: "获取验证码",
                disabled: false,
                errors: {},

            }
        },
        computed:{
            isClick(){
                if(!this.phone || !this.verifyCode) return true
                else return false
            }
        },
        methods: {
            handleLogin(){
                // 清除错误信息
                this.errors ={};
                //发送请求
                this.$axios.post('/api/posts/sms_back', {
                    //发送相关验证信息
                    phone: this.phone,
                    code : this.verifyCode
                }).then(res => {
                    console.log(res);
                    //检验成功 设置cookie 并跳转
                    localStorage.setItem('ele_login', true);
                    this.$router.push('/');
                }).catch(err => {
                    //失败 设置code错误信息
                    this.errors = {
                        code : err.response.msg
                    }
                })
            },
            getVrifyCode(){
                //
                if(this.validatePhone()){
                    //改变获取验证码按钮内容及样式
                    this.validateBtn();
                    //手机号验证后，发送网络请求
                    this.$axios.post("/api/posts/sms_send",{
                        tpl_id: '151670',
                        key: 'a730f494ba9e2937482a111000f439a2',
                        phone: this.phone
                    })
                    .then(res => {
                        console.log(res);
                    })
                }
            },
            validateBtn() {
                //改变获取验证码  内容及样式
                let time = 60;
                let timer = setInterval(() => {
                    if(time == 0){
                        clearInterval(timer);
                        this.btnTitle = "获取验证码";
                        this.disabled = false
                    }else {
                        this.btnTitle = time+"秒后重试";
                        this.disabled = true;
                        time--;
                    }
                },1000)
            },
            validatePhone() {
                // 验证手机号码
                if (!this.phone) {
                    this.errors = {
                        phone: "手机号码不能为空"
                    };
                    return false;
                } else if (!/^1[345678]\d{9}$/.test(this.phone)) {
                    this.errors = {
                        phone: "请填写正确的手机号码"
                    };
                    return false;
                } else {
                    this.errors = {};
                    return true;
                }
            }
        },
        components: {
            InputGroup
        }
    }
</script>

<style scoped>
    .login {
        width: 100%;
        height: 100%;
        padding: 30px;
        box-sizing: border-box;
        background: #fff;
    }

    .logo {
        text-align: center;
    }
    .logo img {
        width: 150px;
    }
    .text_group,
    .login_des,
    .login_btn {
        margin-top: 20px;
    }
    .login_des {
        color: #aaa;
        line-height: 22px;
    }
    .login_des span {
        color: #4d90fe;
    }
    .login_btn button {
        width: 100%;
        height: 40px;
        background-color: #48ca38;
        border-radius: 4px;
        color: white;
        font-size: 14px;
        border: none;
        outline: none;
    }
    .login_btn button[disabled] {
        background-color: #8bda81;
    }
</style>
