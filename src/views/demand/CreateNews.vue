<template>
  <div class="form-list-wrapper">
    <el-card shadow="always">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="form-list">
        <el-form-item label="新闻标题：" prop="title">
          <el-input v-model="ruleForm.title" show-word-limit placeholder="请输入" />
        </el-form-item>
        <el-form-item label="新闻作者：" prop="author">
          <el-input v-model="ruleForm.author" show-word-limit placeholder="请输入" />
        </el-form-item>
        <el-form-item label="新闻封面：" prop="author">
          <ImageUpload @on-success="getFileList" :key="updatekey" @on-delete="getDeleteFileList"
              :list="ruleForm.attachments"></ImageUpload>
        </el-form-item>
        <el-form-item label="新闻详情：" prop="content">
          <Editor v-model="ruleForm.content" />
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
import Editor from '@/components/Editor'
import {saveNews,queryNews} from '@/api/news'
import ImageUpload from "@/components/UploadImage/index.vue";
export default {
  name: 'Form',
  components: { Editor,ImageUpload },
  data() {
    return {
      ruleForm: {
        title: '',
        author: '',
        attachments:[],
        content:''
      },
      updatekey:1,
      rules: {
        name: [
          { required: true, message: '新闻标题不能为空', trigger: 'blur' }
        ],
      },

    }
  },
  created(){
    this.newsId = this.$route.query.newsId || ''

    if(this.newsId){
      queryNews({newsId:this.newsId}).then(res => {

        for (const key in this.ruleForm) {
          this.ruleForm[key] = res.data[key]
        }
        this.updatekey++
      })
    }
      
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

    getFileList(list) {
      this.ruleForm.attachments.push(list)
    },
    getDeleteFileList(list) {
      this.ruleForm.attachments = list
    },
    onSubmit(){
      let data = {
        ...this.ruleForm,
        newsId:this.newsId
      }
      saveNews(data).then(res => {
        if(res.code == 0){
          this.$message({
          showClose: true,
          message: '提交成功',
          type: 'success'
        });
          setTimeout(()=>{
            this.$store.commit('delVisitedView',{path:'/good/createNews'})
            this.$router.push({name:'NewsList'})
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
      width: 100%;
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
