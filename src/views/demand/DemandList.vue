<template>
  <div class="table-classic-wrapper">
    <el-card shadow="always">
      <!-- 操作栏 -->
      <div class="control-btns">
        <!-- <el-button type="primary" @click="handleCreate">新建新闻</el-button> -->
        <!-- <el-button type="primary" @click="handleImport">导入数据</el-button> -->
        <!-- <el-button type="primary" @click="exportVisible = true">导出数据</el-button> -->
        <!-- <el-button type="danger" @click="batchDelete">批量删除</el-button> -->
      </div>
      <!-- 查询栏 -->
      <el-form ref="searchForm" :inline="true" :model="listQuery" label-width="90px" class="search-form">
        <el-form-item label="">
          <el-input v-model="listQuery.name" placeholder="昵称" />
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="listQuery.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="listQuery.phone" placeholder="电话" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格栏 -->
      <el-table ref="multipleTable" v-loading="listLoading" :data="tableData" tooltip-effect="dark" style="width: 100%"
        size="medium" @selection-change="handleSelectionChange">
        <el-table-column prop="name" label="昵称" align="left" width="120" sortable />
        <el-table-column prop="email" label="邮箱" align="left" sortable />
        <el-table-column prop="phone" label="手机" align="left" width="150" sortable />
        <el-table-column prop="desc" label="描述" align="left" sortable />
        <el-table-column prop="updateTime" label="更新时间" align="left" width="200" sortable />
        <el-table-column prop="goodId" label="需求产品" align="left" width="100" sortable >
          <template slot-scope="scope">
            <div>
              {{scope.row.goodInfo.name}}
              </div>
          </template>
        </el-table-column>


        <el-table-column label="产品图片" align="left" width="200">
          <template slot-scope="scope">
            <div>
              <img style="width: 40px;height: 40px;margin-right: 5px;cursor: pointer;" v-for="item in scope.row.goodInfo.attachments" :src="item.url" alt=""
                @click="showImage(item)"></div>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页栏 -->
      <!-- <Pagination :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize"
        @pagination="fetchData" /> -->
    </el-card>


    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
// import { getTableList } from "@/api";
import { queryDemandList,removeDemand } from "@/api/demand";
import Pagination from "@/components/Pagination";
import Upload from "@/components/Upload";
import Hints from "@/components/Hints";
import ImageUpload from "@/components/UploadImage/index.vue";
import dayjs from 'dayjs'

export default {
  name: "Demand",
  components: { Pagination, Upload, Hints, ImageUpload },
  data() {
    return {
      // 数据列表加载动画
      listLoading: true,
      // 查询列表参数对象
      listQuery: {
        name: null,
        categoryId: null,
        pageNo: 1,
        pageSize: 100,
      },
      // 新增/编辑提交表单对象
      dialogForm: {
        name: undefined,
        phone: undefined,
        married: undefined,
        hobby: [],
      },
      // 数据总条数
      total: 0,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      // 新增/编辑 弹出框显示/隐藏
      formVisible: false,
      // 表单校验 trigger: ['blur', 'change'] 为多个事件触发
      formRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
        ],
      },
      // 防止多次连续提交表单
      isSubmit: false,

      dialogImageUrl: '',
      dialogVisible: false,
      categoryRules: {
        categoryName: [
          { required: true, message: '请输入系列名称', trigger: 'blur' },
        ]
      },
      categoryForm: {
        categoryName: '',
        desc: '',
        attachments: []
      },
      categoryId: '',
      selectData:[]
    };
  },
  created() {
    this.fetchData();
    
  },
  methods: {
    showImage(item) {
      this.dialogImageUrl = item.url;
      this.dialogVisible = true;
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 新建数据
    handleCreate() {
      this.$router.push({path:'/news/createDemand'})
    },
    // 编辑数据
    handleEdit(index, row) {
      this.$router.push({path:'/news/createDemand?demandId='+row.demandId})
    },
    // 删除数据
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作将删除选中数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 此处可添加--删除接口
          // 删除成功调用fetchData方法更新列表
          removeDemand({ demandId: row.demandId }).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.fetchData()
          })

        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 批量删除
    batchDelete() {
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: "请先选择要删除的数据！",
          type: "warning",
        });
      } else {
        this.handleDelete();
      }
    },
    // 新增/编辑弹出框 关闭时操作
    handleClose() {
      this.formVisible = false;
      this.$refs.dialogForm.resetFields();
    },
    // 获取数据列表
    fetchData() {
      this.listLoading = true;
      // 获取数据列表接口
      queryDemandList(this.listQuery)
        .then((res) => {
          const data = res;
          if (res.code === 0) {
        
            this.total = res.data.length;
            this.tableData = res.data.map(item => {
              item.updateTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm')
              return item
            });
            this.listLoading = false;
          }
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 查询数据
    onSubmit() {
      this.listQuery.pageNo = 1;
      this.fetchData();
    },
    onReset(){
      for (const key in this.listQuery) {
        this.listQuery[key] = ''
      }
      this.fetchData();
    },
    // 导入数据
    handleImport() {
      this.importVisible = true;
    },
    // 新增/编辑表单确认提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 此处添加 新增/编辑数据的接口 新增成功后调用fetchData方法更新列表
          // 先 this.isSubmit = true 接口返回成功后 再 this.isSubmit = false
          this.saveCategory()
          this.formVisible = false;
        } else {
          this.isSubmit = false;
          return false;
        }
      });
    },
    saveCategory() {
      let params = {
        ...this.categoryForm,
        categoryId: this.categoryId || ''
      }
      saveCategory(this.categoryForm).then(res => {
        this.fetchData()
      })
    }
  },
};
</script>

<style lang="less">
.table-classic-wrapper {
  .el-card {
    min-height: 656px;
  }

  .control-btns {
    margin-bottom: 20px;
  }

  .search-form {
    padding-top: 18px;
    margin-bottom: 15px;
    background-color: #f7f8fb;
  }

  .el-table thead {
    font-weight: 600;

    th {
      background-color: #f2f3f7;
    }
  }

  .dialog-form {
    .el-input {
      width: 380px;
    }

    .footer-item {
      margin-top: 50px;
      text-align: right;
    }
  }

  .upload-box,
  .export-data {
    width: 300px;
    margin: 0 auto 30px;
  }

  .upload-box {
    width: 156px;

    .files-upload {
      color: #20a0ff;
    }
  }

  .hints {
    font-size: 12px;
    color: #aaa;
    text-align: center;
  }
}

.table-classic-wrapper .dialog-form .el-input {
  width: 100%;
}</style>
