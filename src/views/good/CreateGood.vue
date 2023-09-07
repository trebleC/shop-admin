<template>
  <div class="form-list-wrapper">
    <el-card shadow="always">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="form-list">
        <el-form-item label="产品名称：" prop="name">
          <el-input v-model="ruleForm.name" show-word-limit placeholder="请输入" />
        </el-form-item>
        <el-form-item label="产品编号：" prop="name">
          <el-input v-model="ruleForm.goodNo" show-word-limit placeholder="请输入" />
        </el-form-item>
        <el-form-item label="产品系列：">
          <el-form-item prop="select">
              <el-select v-model="ruleForm.categoryId" placeholder="请选择">
                <el-option v-for="item in selectData" :key="item.categoryId" :label="item.categoryName" :value="item.categoryId">
                  <span style="float: left">{{ item.categoryName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">id：{{ item.categoryId || '--' }}</span>
                </el-option>
              </el-select>
            </el-form-item>
        </el-form-item>
 
        <el-form-item label="产品简介：" prop="desc">
            <el-input
              v-model="ruleForm.desc"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
              placeholder="请输入内容"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="产品材料：" prop="attachments">
            <ImageUpload @on-success="getFileList" :key="updatekey"  @on-delete="getDeleteFileList"
              :list="ruleForm.attachments"></ImageUpload>
          </el-form-item>
          <el-form-item label="产品描述：" prop="desc">
            <el-button @click="btachFrom">一键重置</el-button>
            <div class="desc-box">
              <div class="desc-item" v-for="(item,index) in specification" :key="index">
                <div class="name">{{ item.label }}</div>
                <el-input
                  v-model="item.value"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 5 }"
                  placeholder="请输入内容"
                  maxlength="50"
                  show-word-limit
              />
              </div>

            </div>
            
          </el-form-item>
 
 
        <el-form-item class="submit-box">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Hints from '@/components/Hints'
import {queryCategoryMap} from '@/api/category'
import {saveGood,queryGood} from '@/api/good'
import ImageUpload from "@/components/UploadImage/index.vue";
export default {
  name: 'Form',
  components: { Hints,ImageUpload },
  data() {
    return {
      ruleForm: {
        name: '',
        goodNo:'',
        categoryId: '',
        desc:'',
        attachments:[]
      },
      selectData:[],
      updatekey:1,
      rules: {
        name: [
          { required: true, message: '产品名称不能为空', trigger: 'blur' }
        ],
      },
      specification:[
        {
          label:'BRAND NAME',
          value:'Yanzi'
        },
        {
          label:'MATERIAL',
          value:'100% Polyester'
        },
        {
          label:'TECHNICS',
          value:'embroidered'
        },
        {
          label:'WIDTH',
          value:"135-140cm(54''/55''inch)"
        },
        {
          label:'MODEL NUMBER',
          value:'J130477A'
        },
        {
          label:'COLOR',
          value:'Support custom colors'
        },
        {
          label:'MOQ',
          value:'30 Yards'
        },
        {
          label:'PAYMENT',
          value:'T/T, Western Union,Paypal etc.'
        },
        {
          label:'OEM/OMD',
          value:'Support'
        },
    ]
    }
  },
  created(){
    this.goodId = this.$route.query.goodId || ''

    queryCategoryMap().then(res => {
      this.selectData = res.data
      this.selectData.unshift({
        categoryName:'无',
        categoryId:null
      })
      if(this.goodId){
        queryGood({goodId:this.goodId}).then(res => {
          this.specification = res.data.specification
          for (const key in this.ruleForm) {
            this.ruleForm[key] = res.data[key]
          }
          this.updatekey ++
        })
      }
      
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.onSubmit()
        } else {
          console.log('提交失败!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    btachFrom(){
      this.specification.map(item => {
        item.value = ''
        return item
      })
    },
    getFileList(list) {
      this.ruleForm.attachments.push(list)
    },
    getDeleteFileList(list) {
      this.ruleForm.attachments = list
    },
    onSubmit(){
      let data = {
        ...this.ruleForm,
        specification:this.specification,
        goodId:this.goodId
      }
      saveGood(data).then(res => {
        if(res.code == 0){
          this.$message({
          showClose: true,
          message: '提交成功',
          type: 'success'
        });
          setTimeout(()=>{
            this.$store.commit('delVisitedView',{path:'/good/createGood'})
            this.$router.push({name:'GoodList'})
          },500)
        }
   
      })
    }
  }
}
</script>

<style lang="less">
.form-list-wrapper {
  .el-form-item__label{
    width: 100px;
  }
  .el-card {
    padding-top: 20px;
  }
  .form-list {
    width: 100%;
    // margin: 0 auto;
    .el-rate {
      line-height: 2;
    }
    .el-select {
      width: 100%;
    }
    > .el-form-item {
      // margin-bottom: 22px;
      width: 80%;
      .line {
        text-align: center;
      }
      .tip-title {
        text-align: right;
        color: #606266;
      }
    }
    .submit-box {
      margin-top: 35px;
      margin-left: 0;
      text-align: center;
    }
  }
  .form-list-wrapper .el-form-item--mini.el-form-item, .form-list-wrapper .el-form-item--small.el-form-item{
    margin-bottom: 0;
  }
  .desc-box{
   
    .desc-item{
      display: flex;
      margin-bottom: 10px;
      .name{
        width: 25%;
        text-align: right;
        margin-right: 10px;
      }
      .el-textarea{
        flex: 1;
      }
     
    }
  }
}
</style>
