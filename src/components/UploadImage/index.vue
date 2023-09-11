<template>
  <!--        :on-change="handleChange"  -->
  <el-upload ref="uploadImage" list-type="picture-card" class="upload-image-wrapper" action=""
    accept=".jpg, .png, .bmp, .jpeg, .webp" :multiple="true" :show-file-list="true" :auto-upload="true"
 
    :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :http-request="httpRequest" li
    :before-upload="beforeUpload" :file-list="fileList"
    >
    <el-button size="small" type="primary" v-if="btnName">{{ btnName }}</el-button>
    <i class="el-icon-plus" v-else></i>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </el-upload>
</template>

<script>
import { Loading } from 'element-ui';
import {uploadFile} from '@/api/upload'
export default {
  name: 'UploadImage',
  props: {
    btnName: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  created() {
    this.fileList = JSON.parse(JSON.stringify(this.list))
  },
  methods: {
    // 自定义的提交函数，取出文件设置进请求参数
    httpRequest(param) {
      const formData = new FormData();
      formData.append("file", param.file);
      formData.append("name", param.file.name);
      let loadingInstance1 = Loading.service({ fullscreen: true });
      uploadFile(formData).then(res => {
        // this.fileList.push(param.file)
        loadingInstance1.close()
        this.$emit('on-success',res.data)
      })
      
    },
    handlePictureCardPreview(file, fileList) { 
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      // console.log('????',file,fileList,this.fileList);
      this.$emit('on-delete',fileList.map(item => {
        return {
          attachmentId:item.attachmentId,
          name:item.name,
          url:item.url,
        }
      }))
      // this.fileList = []
    },
    //限制上传时的文件格式大小
    beforeUpload(file) {
      // 获取文件名（不包括文件类型后缀）
      let nameArray = file.name.split('.')
      nameArray.pop(1)
      let name = nameArray.join('.')

      // const isType = /\.(jpg|png|bmp|jpeg|webp)$/.test(file.name)
      const isName = /^[a-zA-Z0-9\-_\.]{1,20}$/.test(name)
      const isLt2M = file.size / 1024 / 1024 / 1024 < 2
      if (!isType) {
        this.$message.error('上传文件只能是.zip .rar .bin .apk格式!')
        return false
      }
      if (!isName) {
        this.$message.error('上传文件名称需为1~20个英文、数字、点号、连字符或下划线')
        return Promise.reject(false)
      }
      // if (!isLt2M) {
      //   this.$message.error('上传文件大小不能超过 512k!')
      //   return false
      // }
    },
    handleChange(image) {
      console.log('handleChange');
      
      const rawImage = image.raw
      if (!rawImage) return false
      if (!this.isImage(rawImage)) {
        this.$message.warning('图片只支持.jpg, .png, .bmp, .jpeg, .webp格式!')
        return false
      }
      if (this.isLimit5M(rawImage)) {
        this.readImage(rawImage)
      }
    },
    isLimit5M(image) {
      const isLimit5M = image.size / 1024 / 1024 < 5
      if (isLimit5M) {
        return true
      } else {
        this.$message.warning('上传的图片大小不能超过5M!')
        return false
      }
    },
    isImage(image) {
      return /\.(jpg|png|bmp|jpeg|webp)$/.test(image.name)
    },
    readImage(image) {
      const reader = new FileReader()
      reader.onload = e => {
        let data
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        this.$emit('on-success', data)
      }
      // 转化为base64
      reader.readAsDataURL(image)
      // 转化为blob
      // reader.readAsArrayBuffer(image)
      reader.onerror = e => {
        this.$message.error('图片读取出错!')
      }
      this.$refs.uploadImage.clearFiles()
    }
  }
}
</script>
<style scoped>
/*去除upload组件过渡效果*/
::v-deep .el-upload-list__item {
  transition: none !important;
}
::v-deep .el-upload-list__item-thumbnail {
    /* 图片在方框内显示长边 */
    object-fit: scale-down !important;
}


</style>