<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-calendar"></i>系统管理</el-breadcrumb-item>
				<el-breadcrumb-item>个人信息</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="form-box">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
					<el-form-item label="用户ID">{{ getUserId }}</el-form-item>
					<el-form-item label="姓名" prop="name">
						<el-input v-model="ruleForm.name"></el-input>
					</el-form-item>
					<el-form-item label="性别" prop="sex">
						<el-radio-group v-model="ruleForm.sex">
							<el-radio label="1">男</el-radio>
							<el-radio label="0">女</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="联系电话" prop="phone">
						<el-input v-model="ruleForm.phone"></el-input>
					</el-form-item>
					<el-form-item label="旧密码" prop="oldPwd">
						<el-input type="password" v-model="ruleForm.oldPwd" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="新密码" prop="nowPwd">
						<el-input type="password" v-model="ruleForm.nowPwd" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="checkPwd">
						<el-input type="password" v-model="ruleForm.checkPwd" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" icon="el-icon-edit-outline" :loading="loading" @click="onSubmit('ruleForm')">提交</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	import Storage from '../../storage/store'

	export default {
		name: 'PersonalDet',
		data: function() {
			let validPwd = (rule, value, callback) => {
				if (this.ruleForm.checkPwd !== '') {
					this.$refs.ruleForm.validateField('checkPwd');
				}
				callback();
			};
			let validNowPwd = (rule, value, callback) => {
				if (this.ruleForm.oldPwd === '' && value !== '') {
					callback(new Error('请先输入旧密码!'));
				} 
				if (this.ruleForm.oldPwd !== '' && value === '') {
					callback(new Error('请先输入新密码!'));
				} 
				if (this.ruleForm.checkPwd !== '') {
					this.$refs.ruleForm.validateField('checkPwd');
				}
				callback();
			};
			let validCheckPwd = (rule, value, callback) => {
				if (this.ruleForm.oldPwd === '' && value !== '') {
					callback(new Error('请先输入旧密码!'));
				} 
				if (value !== this.ruleForm.nowPwd) {
					callback(new Error('两次输入密码不一致!'));
				}
				callback();
			};
			return {
				loading: false,
				ruleForm: {
					id: Storage.fetch("user").id,
					name: Storage.fetch("user").name,
					sex: Storage.fetch("user").sex?'1':'0',
					phone: Storage.fetch("user").phone,
					oldPwd: '',
					nowPwd: '',
					checkPwd: '',
					pwd: 0
				},
				rules: {
					name: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}],
					sex: [{
						required: true,
						message: '请选择性别',
						trigger: 'blur'
					}],
					phone: [{
						required: true,
						message: '请输入联系电话',
						trigger: 'blur'
					}],
					oldPwd: [{
						validator: validPwd,
						trigger: 'blur'
					}],
					nowPwd: [{
						validator: validNowPwd,
						trigger: 'blur'
					}],
					checkPwd: [{
						validator: validCheckPwd,
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			onSubmit(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading = true;
						if (this.ruleForm.oldPwd !== '') {
							this.ruleForm.pwd = 1;
						}
						var param = this.$qs.stringify(this.ruleForm);
						this.$axios.post('/manage/system/person', param).then((res) => {
							this.loading = false;
							if (res.data.code == "success") {
								this.$message.success(`提交成功!`);	
							} else {
								this.$message.error(res.data.code_name);
							}
						}).catch(() => {
							this.loading = false;
							this.$message.error(res.data.code_name);
							console.log(res);
						});
					} else {
						console.log('error valid submit!!');
						return false;
					}
				});
			}
		},
		computed: {
			getUserId() {
				return Storage.fetch('user').id;
			},
			getAccount() {
				return Storage.fetch('user').account;
			}
		}
	}
</script>
