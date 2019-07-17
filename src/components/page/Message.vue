<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 消息中心</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane :label="`未读消息(${unread.length})`" name="first">
                    <el-table :data="unread" :show-header="false" style="width: 100%">
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title">{{scope.row.content}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_date" width="180" :formatter="formatter"></el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleRead(scope.$index)">标为已读</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="handle-row">
                        <el-button type="primary" @click="readAll" :loading="loading">全部标为已读</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="`已读消息(${read.length})`" name="second">
                    <template v-if="message === 'second'">
                        <el-table :data="read" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.content}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="create_date" width="150" :formatter="formatter"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button type="danger" @click="handleDel(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger" @click="delAll" :loading="loading">删除全部</el-button>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`回收站(${recycle.length})`" name="third">
                    <template v-if="message === 'third'">
                        <el-table :data="recycle" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.content}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="create_date" width="150" :formatter="formatter"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button @click="handleRestore(scope.$index)">还原</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger" @click="resetAll" :loading="loading">清空回收站</el-button>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
	import Storage from '../../storage/store'
	
    export default {
        name: 'message',
        data() {
            return {
                message: 'first',
				loading: false,
                unread: [],
                read: [],
                recycle: []
            }
        },
		created() {
			this.getData();
		},
        methods: {
			getData() {
				var param = this.$qs.stringify({
					userId: Storage.fetch("user").id,
					officeId: Storage.fetch("user").office_id
				});
				this.$axios.get("/manage/home/search?" + param).then(res => {
					if (res.data.code == "success") {
						this.unread = res.data.data.wd.list;
						this.read = res.data.data.yd.list;
						this.recycle = res.data.data.hsz.list;
					} else {
						console.log(res);
						this.$message.error(res.data.code_name);
					}
				});
			},
			// 表格列格式化
			formatter(row, column, cellValue) {
				return this.$utils.dateFormat("yyyy-MM-dd", cellValue);
			},
            handleRead(index) {
				const row = this.unread[index];
				let param = this.$qs.stringify({
					id: row.id,
					type: 'update',
					oldStatus: '0',
					nowStatus: '10',
					userId: Storage.fetch("user").id,
					officeId: Storage.fetch("user").office_id
				});
				this.$axios.post('/manage/home/edit', param).then(res => {
					if (res.data.code == "success") {
						const item = this.unread.splice(index, 1);
						this.read = item.concat(this.read);
					} else {
						this.$message.error(res.data.code_name);
					}
				});
            },
            handleDel(index) {
				const row = this.read[index];
				let param = this.$qs.stringify({
					id: row.id,
					type: 'update',
					oldStatus: '10',
					nowStatus: '-10',
					userId: Storage.fetch("user").id,
					officeId: Storage.fetch("user").office_id
				});
				this.$axios.post('/manage/home/edit', param).then(res => {
					if (res.data.code == "success") {
						const item = this.read.splice(index, 1);
						this.recycle = item.concat(this.recycle);
					} else {
						this.$message.error(res.data.code_name);
					}
				});
            },
            handleRestore(index) {
				const row = this.recycle[index];
				let param = this.$qs.stringify({
					id: row.id,
					type: 'update',
					oldStatus: '-10',
					nowStatus: '10',
					userId: Storage.fetch("user").id,
					officeId: Storage.fetch("user").office_id
				});
				this.$axios.post('/manage/home/edit', param).then(res => {
					if (res.data.code == "success") {
						const item = this.recycle.splice(index, 1);
						this.read = item.concat(this.read);
					} else {
						this.$message.error(res.data.code_name);
					}
				});
            },
			readAll() {
				this.$confirm('是否将所有消息标为已读?', '提示').then(() => {
					this.loading = true;
					let param = this.$qs.stringify({
						type: 'update',
						oldStatus: '0',
						nowStatus: '10',
						userId: Storage.fetch("user").id,
						officeId: Storage.fetch("user").office_id
					});
					this.$axios.post('/manage/home/edit', param).then(res => {
						this.loading = false;
						if (res.data.code == "success") {
							this.$message({type: 'success', message: '消息已标为已读!'});
							this.read = this.read.concat(this.unread);
							this.unread = [];
						} else {
							this.$message.error(res.data.code_name);
						}
					});
				});
			},
			delAll() {
				this.$confirm('是否将所有消息移至回收站?', '提示').then(() => {
					this.loading = true;
					let param = this.$qs.stringify({
						type: 'update',
						oldStatus: '10',
						nowStatus: '-10',
						userId: Storage.fetch("user").id,
						officeId: Storage.fetch("user").office_id
					});
					this.$axios.post('/manage/home/edit', param).then(res => {
						this.loading = false;
						if (res.data.code == "success") {
							this.$message({type: 'success', message: '消息已移至回收站!'});
							this.recycle = this.recycle.concat(this.read);
							this.read = [];
						} else {
							this.$message.error(res.data.code_name);
						}
					});
				});
			},
			resetAll() {
				this.$confirm('是否清空回收站?', '提示').then(() => {
					this.loading = true;
					let param = this.$qs.stringify({
						type: 'delete',
						userId: Storage.fetch("user").id,
						officeId: Storage.fetch("user").office_id
					});
					this.$axios.post('/manage/home/edit', param).then(res => {
						this.loading = false;
						if (res.data.code == "success") {
							this.$message({type: 'success', message: '已清空回收站!'});
							this.recycle = [];
						} else {
							this.$message.error(res.data.code_name);
						}
					});
				});
			}
        },
        computed: {
			
        }
    }

</script>

<style>
.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}
</style>

