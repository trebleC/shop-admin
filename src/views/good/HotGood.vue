<template>
  <div class="table-classic-wrapper">
    <!-- <Hints>
      <template slot="hintName">Table表格组件</template>
      <template slot="hintInfo">
        <p>
          element-Table：使用elementUI的Table组件，可用于展示多条结构类似的数据，并对其进行相关操作
        </p>
        <p>
          地址：访问
          <el-link type="success" href="https://element.eleme.cn/2.13/TableClassic.vue#/zh-CN/component/table"
            target="_blank">element-Table</el-link>
        </p>
      </template>
    </Hints> -->
    <el-card shadow="always">
      <!-- 操作栏 -->
      <div class="control-btns">
        <el-button type="primary" @click="handleCreate">新建产品</el-button>
        <!-- <el-button type="primary" @click="handleImport">导入数据</el-button> -->
        <!-- <el-button type="primary" @click="exportVisible = true">导出数据</el-button> -->
        <!-- <el-button type="danger" @click="batchDelete">批量删除</el-button> -->
      </div>
      <!-- 查询栏 -->
      <el-form ref="searchForm" :inline="true" :model="listQuery" label-width="90px" class="search-form">
        <el-form-item label="产品名称">
          <el-input v-model="listQuery.name" placeholder="产品名称" />
        </el-form-item>
        <el-form-item label="产品系列">
          <el-select v-model="listQuery.categoryId" placeholder="产品系列">
            <el-option v-for="(item,index) in selectData" :key="'w'+index"  :value="item.categoryId" :label="item.categoryName" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格栏 -->
      <el-table ref="multipleTable" v-loading="listLoading" :data="tableData" tooltip-effect="dark" style="width: 100%"
        size="medium" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="60" /> -->
        <el-table-column prop="name" label="产品名称" align="left" width="200" sortable />
        <el-table-column prop="goodNo" label="产品编号" align="left" width="150" sortable />
        <el-table-column prop="categoryName" label="产品系列" align="left" width="200" sortable />
        <el-table-column prop="views" label="浏览量" align="left" width="150" sortable />
        <el-table-column label="产品描述" align="left">
          <template slot-scope="scope">{{ scope.row.desc }}</template>
        </el-table-column>
        <el-table-column label="附件材料" align="left">
          <template slot-scope="scope">
            <div>
              <img style="width: 40px;height: 40px;margin-right: 5px;cursor: pointer;" v-for="item in scope.row.attachments" :src="item.url" alt=""
                @click="showImage(item)"></div>
          </template>
          <!-- <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <div><img style="width: 40px;height: 40px;" v-for="item in scope.row.attachments" :src="item.url" alt=""></div>
              <div slot="reference">
                <el-tag size="medium">{{ scope.row.name }}</el-tag>
              </div>
            </el-popover>
          </template> -->
        </el-table-column>


        <!-- <el-table-column label="锁定" align="center" width="100">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.forbid" @change="stateChange(scope.row)" />
          </template>
        </el-table-column> -->
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" :disabled="scope.row.forbid"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页栏 -->
      <!-- <Pagination :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize"
        @pagination="fetchData" /> -->
      <!-- 新增/编辑 弹出栏 -->
      <el-dialog title="新建系列" :visible.sync="formVisible" width="50%" class="dialog-form" :before-close="handleClose">
        <el-form ref="dialogForm" :model="categoryForm" :rules="categoryRules" label-width="100px">
          <el-form-item label="系列名称：" prop="categoryName">
            <el-input v-model="categoryForm.categoryName" />
          </el-form-item>
          <el-form-item label="系列描述：">
            <el-input type="textarea" placeholder="请输入内容" v-model="categoryForm.desc">
            </el-input>
          </el-form-item>
          <el-form-item label="系列材料：" prop="attachments">
            <ImageUpload @on-success="getFileList" :key="categoryId + 'img'" @on-delete="getDeleteFileList"
              :list="categoryForm.attachments"></ImageUpload>
          </el-form-item>
          <div class="footer-item">
            <el-button @click="cancleForm">取 消</el-button>
            <el-button type="primary" :disabled="isSubmit" @click="submitForm('dialogForm')">确 定</el-button>
          </div>
        </el-form>
      </el-dialog>
      <!-- 导入数据 弹出栏 -->
      <el-dialog title="导入数据" :visible.sync="importVisible" width="20%">
        <div class="upload-box">
          <span>选择文件：</span>
          <Upload :files-format="filesFormat">
            <i class="vue-dsn-icon-upload" />上传文件
          </Upload>
        </div>
        <div class="hints">TIP：请选择要导出数据的格式。</div>
        <span slot="footer">
          <el-button @click="cancleImport">取 消</el-button>
          <el-button type="primary" @click="confirmImport">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 导出数据 弹出栏 -->
      <el-dialog title="导出数据" :visible.sync="exportVisible" width="30%">
        <div class="export-data">
          <el-button type="primary" @click="exportTable('xlsx')">EXCEL格式</el-button>
          <el-button type="primary" @click="exportTable('csv')">CSV格式</el-button>
          <el-button type="primary" @click="exportTable('txt')">TXT格式</el-button>
        </div>
        <div class="hints">TIP：请选择要导出数据的格式。</div>
      </el-dialog>
    </el-card>


    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
// import { getTableList } from "@/api";
import { queryCategoryMap } from "@/api/category";
import { queryHotGoodList,deleteGood } from "@/api/good";
import excel from "@/utils/excel";
import Pagination from "@/components/Pagination";
import Upload from "@/components/Upload";
import Hints from "@/components/Hints";
import ImageUpload from "@/components/UploadImage/index.vue";

export default {
  name: "Good",
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
      // 导入数据 弹出框显示/隐藏
      importVisible: false,
      // 导出文件格式
      filesFormat: ".txt, .csv, .xls, .xlsx",
      // 导出数据 弹出框显示/隐藏
      exportVisible: false,


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
    queryCategoryMap().then(res => {
      this.selectData = res.data
      // this.selectData.unshift({
      //   categoryName:'无',
      //   categoryId:null
      // })
      this.fetchData();
      
    })
    
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
      this.$router.push({path:'/good/createGood'})
    },
    // 编辑数据
    handleEdit(index, row) {
      this.$router.push({path:'/good/createGood?goodId='+row.goodId})
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
          deleteGood({ goodId: row.goodId }).then(res => {
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
      queryHotGoodList(this.listQuery)
        .then((res) => {
          const data = res;
          if (res.code === 0) {
            res.data.map(item => {
              this.selectData.map(_item => {
                if(_item.categoryId == item.categoryId){
                  item.categoryName = _item.categoryName
                }
              })
              return item
            })
            this.total = res.data.length;
            this.tableData = res.data;
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
    // 新增/编辑表单取消提交
    cancleForm() {
      this.$refs.dialogForm.resetFields();
      this.formVisible = false;
    },
    // 导入数据弹出栏 确认操作
    confirmImport() {
      // 此处添加 后台接收的接口，将导入的数据传给后台处理
      this.importVisible = false;
    },
    // 导入数据弹出栏 取消操作
    cancleImport() {
      // 将导入的数据清空
      this.importVisible = false;
    },
    // 导出数据--excle格式
    exportTable(type) {
      if (this.tableData.length) {
        const params = {
          header: [
            "编号",
            "姓名",
            "性别",
            "手机",
            "学历",
            "婚姻状况",
            "禁止编辑",
            "爱好",
          ],
          key: [
            "id",
            "name",
            "sex",
            "phone",
            "education",
            "married",
            "forbid",
            "hobby",
          ],
          data: this.tableData,
          autoWidth: true,
          fileName: "综合表格",
          bookType: type,
        };
        excel.exportDataToExcel(params);
        this.exportVisible = false;
      }
    },
    // 列表中婚姻状况栏，状态值改变时，调用
    selectChange(row) {
      // 此处添加后台接口，成功后调用fetchData方法更新列表
    },
    // 列表中禁止编辑栏，状态值改变时，调用
    stateChange(row) {
      // 此处添加后台接口，成功后调用fetchData方法更新列表
    },

    getFileList(list) {
      this.categoryForm.attachments.push(list)
    },
    getDeleteFileList(list) {
      this.categoryForm.attachments = list
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
