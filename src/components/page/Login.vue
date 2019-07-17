<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">服务与接口资源平台</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="account">
                    <el-input v-model="ruleForm.account" placeholder="account">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" :loading="loading" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
            </el-form>
        </div>
    </div>
</template>

<script>
	import Storage from '../../storage/store'
	
    export default {
        data: function(){
            return {
				loading: false,
                ruleForm: {
                    account: '',
                    password: ''
                },
                rules: {
                    account: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
						this.loading = true;
						var param = this.$qs.stringify(this.ruleForm);
						localStorage.setItem('token', this.$utils.token);
						localStorage.setItem('ms_username', 'xiaokai');
						this.$router.push('/dashboard');
						/* this.$axios.post('/manage/login', param).then((res) => {
							this.loading = false;
							if (res.data.code == "success") {
								localStorage.setItem('token', this.$utils.token + '-' + res.data.user.id);
								Storage.save("items", res.data.items);
								Storage.save("user", res.data.user);
								Storage.save("offices", res.data.offices);
								Storage.save("roles", res.data.roles);
								this.$router.push('/dashboard');
							} else {
								this.$message.error(res.data.code_name);
							}
						}).catch(() => {
							this.loading = false;
						}); */
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        /* background-image: url(../../assets/img/login-bg.jpg); */
		background: #242f42;
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>