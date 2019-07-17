<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 系统管理</el-breadcrumb-item>
				<el-breadcrumb-item>账户信息</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="officeId" placeholder="所在处室" class="handle-select mr10">
					<el-option key="0" label="村镇处" value=""></el-option>
					<el-option key="1" label="住保处" value="1"></el-option>
					<el-option key="2" label="信息中心" value="2"></el-option>
				</el-select>
				<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
				<el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
				<el-button type="primary" icon="el-icon-circle-plus" @click="handleAdd">新增</el-button>
			</div>
			<el-table :data="tableData" border stripe class="table">
				<el-table-column prop="name" label="姓名"></el-table-column>
				<el-table-column prop="sex" label="性别"></el-table-column>
				<el-table-column prop="phone" label="联系电话"></el-table-column>
				<el-table-column prop="office" label="所在处室"></el-table-column>
				<el-table-column prop="account" label="账户"></el-table-column>
				<el-table-column prop="status" label="状态"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="text" icon="el-icon-refresh" class="orange" 
							@click="handleDelete(scope.$index, scope.row)">重置密码</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="count">
				</el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框  -->
		<el-dialog v-dialogDrag title="编辑" :visible.sync="editVisible" width="30%">
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="姓名">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-switch v-model="form.sex" active-color="#409eff" 
						inactive-color="#ff4949" active-text="男" inactive-text="女">
					</el-switch>
				</el-form-item>
				<el-form-item label="账号">
					<el-input v-model="form.account" :disabled="disabled"></el-input>
				</el-form-item>
				<el-form-item label="联系电话">
					<el-input v-model="form.phone"></el-input>
				</el-form-item>
				<el-form-item label="所属处室">
					<el-select v-model="form.office_id" class="form-select">
						<el-option v-for="item in options" :key="item.id" 
							:label="item.short_name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="角色">
					<el-select v-model="form.role_id" class="form-select">
						<el-option v-for="item in roles" :key="item.id" 
							:label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-switch v-model="form.status"></el-switch>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEdit" :loading="loading">提 交</el-button>
			</span>
		</el-dialog>

		<!-- 删除提示框 -->
		<el-dialog v-dialogDrag title="密码重置" :visible.sync="delVisible" width="300px" center>
			<div class="del-dialog-cnt">重置密码不可恢复，是否重置？</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="delVisible = false">取 消</el-button>
				<el-button type="primary" @click="deleteRow" :loading="loading">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import Storage from '../../storage/store'
	
	export default {
		name: 'basetable',
		data() {
			return {
				url: '',
				count: 0,
				loading: false,
				tableData: [],
				cur_page: 1,
				officeId: '',
				disabled: false,
				options: [],
				roles: [],
				select_word: '',
				editVisible: false,
				delVisible: false,
				form: {
					name: '',
					sex: '',
					phone: '',
					office_id: '',
					account: '',
					status: ''
				},
				idx: -1
			}
		},
		created() {
			this.getData();
			this.options = Storage.fetch("offices");
			this.roles = Storage.fetch("roles");
		},
		methods: {
			// 分页导航
			handleCurrentChange(val) {
				this.cur_page = val;
				this.getData();
			},
			// 获取接口分页数据
			getData() {
				var param = this.$qs.stringify({
					page: this.cur_page
				});
				this.url = '/easymock/acclist?' + param;
				this.$axios.post(this.url).then(res => {
					if (res.data.success) {
						this.tableData = res.data.list;
						this.count = res.data.count;
					} else {
						console.log(res);
						this.$message.error(res.data.msg);
					}
				})
			},
			// 表格列格式化
			formatter(row, column, cellValue) {
				/* if (column.property == "sex") {
					return cellValue ? "男" : "女";
				} else if (column.property == "status") {
					return cellValue ? "有效" : "无效";
				} */
			},
			search() {
				this.getData();
			},
			handleAdd() {
				this.form = {
					id: '',
					name: '',
					sex: true,
					phone: '',
					office_id: '',
					role_id: '',
					account: '',
					status: true,
					userId: Storage.fetch("user").id
				}
				this.disabled = false;
				this.editVisible = true;
			},
			handleEdit(index, row) {
				this.idx = index;
				this.disabled = true;
				const item = this.tableData[index];
				this.form = {
					id: item.id,
					name: item.name,
					sex: item.sex,
					phone: item.phone,
					office_id: item.office_id,
					role_id: item.role_id,
					account: item.account,
					status: item.status,
					userId: Storage.fetch("user").id
				}
				this.editVisible = true;
			},
			handleDelete(index, row) {
				this.idx = index;
				const item = this.tableData[index];
				this.form = {
					id: item.id,
					userId: Storage.fetch("user").id
				}
				this.delVisible = true;
			},
			// 保存编辑
			saveEdit() {
				this.loading = true;
				let param = this.$qs.stringify(this.form);
				let url = '';
				if (this.form.id == '') {
					url = '/manage/system/user/add';
				} else {
					url = '/manage/system/user/edit';
				}
				this.$axios.post(url, param).then((res) => {
					this.loading = false;
					if (res.data.code == "success") {
						this.getData();
						this.editVisible = false;
						this.$message.success(`提交成功`);
					} else {
						this.$message.error(res.data.code_name);
					}
					this.editVisible = false;
				}).catch(error => {
					this.loading = false;
					this.$message.error('请求异常！');
					console.log(error);
				});
			},
			// 确定删除
			deleteRow() {
				this.loading = true;
				let param = this.$qs.stringify(this.form);
				this.$axios.post('/manage/system/user/pwd', param).then((res) => {
					this.loading = false;
					if (res.data.code == "success") {
						this.$message.success('重置密码成功');
						this.delVisible = false;
					} else {
						this.$message.error(res.data.code_name);
					}
					this.delVisible = false;
				}).catch(() => {
					this.loading = false;
					this.$message.error(res.data.code_name);
					console.log(res);
				});
			}
		}
	}
</script>

<style scoped>
	.handle-box {
		margin-bottom: 20px;
	}

	.handle-select {
		width: 120px;
	}

	.handle-input {
		width: 300px;
		display: inline-block;
	}

	.del-dialog-cnt {
		font-size: 16px;
		text-align: center
	}

	.table {
		width: 100%;
		font-size: 14px;
	}

	.orange {
		color: #e6a23c;
	}

	.mr10 {
		margin-right: 10px;
	}
	
	.form-select {
		width: 100%;
	}
</style>
