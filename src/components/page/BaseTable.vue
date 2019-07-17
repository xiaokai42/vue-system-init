<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 服务资源</el-breadcrumb-item>
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
            </div>
            <el-table :data="tableData" border stripe class="table">
                <el-table-column prop="name" label="资源名称" width="300"></el-table-column>
                <el-table-column prop="dept" label="所在处室"></el-table-column>
                <el-table-column prop="date" label="发布时间"></el-table-column>
				<el-table-column prop="state" label="服务状态"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-document" @click="detail(scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="count">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
	import Storage from '../../storage/store'
	
    export default {
        name: 'basetable',
        data() {
            return {
				count: 0,
                url: '',
                tableData: [],
                cur_page: 1,
                officeId: '',
				options: [],
                select_word: '',
                idx: -1
            }
        },
        created() {
            this.getData();
			this.options = Storage.fetch("offices");
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
			// 获取接口分页数据
            getData() {
				/* var param = this.$qs.stringify({
					page: this.cur_page,
					type: "0",
					userId: Storage.fetch("user").id,
					officeId: this.officeId,
					name: this.select_word
				}); */
				let param = this.$qs.stringify({
					page: this.cur_page
				});
				this.url = "/easymock/info-table?" + param;
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
				/* if (column.property == "status") {
					return cellValue ? "正常" : "异常";
				} else if (column.property == "share") {
					return cellValue ? "有" : "无";
				} else if (column.property == "update_date") {
					return this.$utils.dateFormat("yyyy-MM-dd", cellValue)
				} */
			},
            search() {
                this.getData();
            },
            detail(row) {
				this.$router.push({ name: 'serve-info-view', params: { id: row.id } });
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
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
</style>
