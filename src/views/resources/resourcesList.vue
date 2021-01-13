<template>
  <div class="sources-list">
    <el-form ref="form"
             :model="form"
             :rules="rulesSearchForm"
             inline>
      <el-form-item label="资源列表"
                    ></el-form-item>
      <el-form-item prop="resourcesBatchId">
        <el-input placeholder="资源批次编号"
                  style="display: none;"
                  class="input-class"
                  v-model="form.resourcesBatchId" />
      </el-form-item>
      <el-form-item prop="batchId">
        <el-input placeholder="批次编号"
                  class="input-class"
                  v-model="form.batchId" />
      </el-form-item>
      <el-form-item prop="batchName">
        <el-input placeholder="批次名称"
                  class="input-class"
                  v-model="form.batchName" />
      </el-form-item>
      <el-form-item prop="number">
        <el-input placeholder="资源编号"
                  class="input-class"
                  v-model="form.number" />
      </el-form-item>
      <el-form-item prop="phone">
        <el-input placeholder="手机号码"
                  class="input-class"
                  v-model="form.phone" />
      </el-form-item>
      <el-form-item prop="name">
        <el-input placeholder="姓名"
                  class="input-class"
                  v-model="form.name" />
      </el-form-item>
      <el-form-item prop="grade">
        <el-input placeholder="年级"
                  class="input-class"
                  v-model="form.grade" />
      </el-form-item>
      <el-form-item prop="school">
        <el-input placeholder="在读学校"
                  class="input-class"
                  v-model="form.school"></el-input>
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="form.status"
                   class="input-class"
                   placeholder="状态">
          <el-option label="新生"
                     value="0"></el-option>
          <el-option label="在读生"
                     value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-left: 20px;">
        <el-button type="primary"
                   @click="submitForm('form')">查询</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
        <el-button style="float: right;" type='primary' v-if="role == '内部用户'" @click="exportData">导出</el-button>
    </el-form>
    <el-table :data="tableData"
              style="width: 100%;"
              class="table-data"
              border
              :row-style="{height: '65px'}"
              :cell-style="{textAlign: 'center'}"
    >
      <el-table-column
                       align="center"
                       prop="batchId"
                       label="批次编号"
                       ></el-table-column>
      <el-table-column prop="batchName"
                       align="center"
                       label="批次名称"
                       ></el-table-column>
      <el-table-column prop="number"
                       align="center"
                       label="资源编号"
                       ></el-table-column>
      <el-table-column prop="phone"
                       align="center"
                       label="手机号码"
                       ></el-table-column>
      <el-table-column prop="name"
                       align="center"
                       label="姓名"
                       ></el-table-column>
      <el-table-column prop="grade"
                       align="center"
                       label="年级"
                       ></el-table-column>
      <el-table-column prop="school"
                       align="center"
                       label="在读学校"
                       ></el-table-column>
      <el-table-column prop="status"
                       align="center"
                       label="状态"
                       :formatter="formatter"></el-table-column>
      <el-table-column prop="handleTime"
                       align="center"
                       label="处理时间"
                       ></el-table-column>
      <el-table-column label="操作"
                       align="center"
                       >
        <template slot-scope="scope">
          <el-button @click.native.prevent="watchDateil(scope.$index, tableData)"
                     type="text"
                     size="middle">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottom-part">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[10, 20, 50, 100]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"></el-pagination>
    </div>
    <el-dialog title='详情'
                class="dialog-detail"
               :visible.sync="isWatch">
      <el-form  ref="detailData"
                :model="detailData"
                label-width="130px"
                label-suffix="："
                class="form"
                inline>
        <el-form-item  label="批次编号" >
          <el-input readonly="true" v-model="detailData.batchId" />
        </el-form-item>
        <el-form-item  label="批次名称">
          <el-input readonly="true" v-model="detailData.batchName" />
        </el-form-item>
          <el-form-item  label="资源编号">
          <el-input readonly="true" v-model="detailData.number" />
        </el-form-item>
        <el-form-item  label="手机号码">
          <el-input readonly="true" v-model="detailData.phone" />
        </el-form-item>
        <el-form-item  label="姓名">
          <el-input readonly="true" v-model="detailData.name" />
        </el-form-item>
        <el-form-item  label="年级">
          <el-input readonly="true" v-model="detailData.grade" />
        </el-form-item>
        <el-form-item  label="就读学校">
          <el-input readonly="true" v-model="detailData.school" />
        </el-form-item>
        <el-form-item  label="状态">
          <el-input readonly="true" :value="detailData.status == 1 ? '在读生' : '新生'" />
        </el-form-item>
        <el-form-item  label="匹配时间">
          <el-input readonly="true" v-model="detailData.handleTime" />
        </el-form-item>
          <el-row type="flex" justify="end">
            <el-button @click="isWatch = false">关闭</el-button>
          </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { resourcesList, resourcesExportList } from '@/api'
// import qs from 'qs'
export default {
  name: 'resourcesList',
  data () {
    const validateNumber = (role, value, callback) => {
      if (value === '' || value == null) {
        callback()
      } else if (!(/\d/.test(value))) {
        callback(new Error('请输入数字资源编号'))
      } else {
        callback()
      }
    }
    const validateSpecial = (rule, value, callback) => {
      if (value === '' || value == null) {
        callback()
      } else if ((/[`~!@#$^&*()=|{}':;',[\]+.<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%_-]/g.test(value))) {
        callback(new Error('请勿输入特殊字符'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (value === '' || value == null) {
        callback()
      } else if (!(/^1[23456789]\d{9}$/.test(value))) {
        callback(new Error('请输入合法手机号码'))
      } else {
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      if (value === '' || value == null) {
        callback()
      } else if (!(/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(value))) {
        callback(new Error('请输入合法姓名'))
      } else {
        callback()
      }
    }
    return {
      form: {
        resourcesBatchId: '',
        batchId: '',
        batchName: '',
        number: '',
        phone: '',
        name: '',
        grade: '',
        school: '',
        status: '',
        handleTime: ''
      },
      rulesSearchForm: {
        resourcesBatchId: [{ required: false, validator: validateSpecial, trigger: 'change' },
          { validator: validateNumber, trigger: 'change' }],
        batchId: [{ required: false, validator: validateSpecial, trigger: 'change' }],
        number: [{ required: false, validator: validateSpecial, trigger: 'change' },
          { validator: validateNumber, trigger: 'change' }],
        grade: [{ required: false, validator: validateSpecial, trigger: 'change' }],
        school: [{ required: false, validator: validateSpecial, trigger: 'change' }],
        phone: [{ required: false, validator: validatePhone, trigger: 'change' }],
        name: [{ required: false, validator: validateName, trigger: 'change' }]
      },
      tableData: [
      ],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      isWatch: false,
      detailData: {
        batchId: '',
        batchName: '',
        number: '',
        phone: '',
        name: '',
        grade: '',
        school: '',
        status: '',
        handleTime: ''
      },
      role: '',
      batchIdParams: undefined // 资源批次页面传来的参数batchId
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.initData(this.form)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      const obj = this.form
      for (const key in obj) {
        obj[key] = ''
      }
      this.batchIdParams = undefined
      this.$router.push({
        path: '/resource/resourcesList'
      })
      console.log('error submit!!', this.form)
    },
    exportData () {
      const option = this.form
      const obj = {}
      for (const key in option) {
        if (option[key] === '' || option[key] == null) {
          continue
        }
        obj[key] = option[key]
        console.log(obj)
      }
      // const query = { pageSize: this.pageSize, pageNum: this.currentPage, ...obj }
      const query = { ...obj }
      // if (this.total >= 1000) return this.$message.error('导出数量超过 1000 条，请联系 管理员进行导出')

      resourcesExportList(query).then(res => {
        const fileName = (res.headers['content-disposition'].split('filename=')[1])
        var decodeFileName = fileName.split('.')[0]
        decodeFileName = decodeURI(decodeFileName.trim())
        // msword pdf zip   // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
        var blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' })
        var downloadElement = document.createElement('a')
        var href = window.URL.createObjectURL(blob) // 创建下载的链接
        downloadElement.href = href
        downloadElement.download = `${decodeFileName}.xlsx` // 下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() // 点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      })
    },
    // 详情查看 p1 number 在表格的索引 p2 object 表格数据对象
    watchDateil (p1, p2) {
      console.log(p1, p2)
      this.isWatch = !this.isWatch
      const obj = JSON.parse(JSON.stringify(p2[p1]))
      console.log(obj)
      for (const key in obj) {
        if (obj[key] == null) {
          obj[key] = '-'
        }
        console.log('obj', obj[key])
        // this.detailData = obj
        this.detailData = obj
      }
    },
    // 页面移动
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.currentPage = Number(val)
      this.initData()
      console.log(`当前页ss: ${this.currentPage}`)
    },
    initData (option) {
      const resourcesBatchId = this.$route.query.id || undefined
      const batchId = this.$route.query.batchId || undefined
      // console.log('batchId', batchId)
      const pageNum = this.currentPage
      const pageSize = this.pageSize
      let obj = {}
      if (option) {
        for (const key in option) {
          if (option[key] === '' || option[key] == null) {
            continue
          }
          obj[key] = option[key]
          // console.log(obj)
        }
      } else if (resourcesBatchId) {
        obj = { resourcesBatchId: resourcesBatchId, batchId: batchId }
        this.form.resourcesBatchId = resourcesBatchId
        this.form.batchId = batchId
      }
      // console.log('obj', obj)
      const query = { pageNum, pageSize, ...obj }
      resourcesList(query).then(res => {
        // console.log("res",res)
        this.tableData = res.rows
        this.total = Number(res.total)
        // this.$message.success('数据加载完成')
      })
    },
    formatter (row, col) {
      return row.status === 1 ? '在读生' : '新生'
    }
  },
  watch: {
    $route () { // 检测路由变化，每次切换页面都会触发这个函数
      // console.log(2)
      this.batchIdParams = this.$route.query.batchId
    },
    batchIdParams: {
      handler (newVal) {
        // console.log('newVal--', newVal)
        if (newVal) {
          this.initData()
        }
        // console.log('oldVal--', oldVal)
      },
      immediate: true
    }
  },
  created () {
    this.initData()
    this.role = this.$store.state.user.roleObj.role
    // this.role = '外部用户'
  }
}
</script>
<style scoped>
  .sources-list {
    position: relative;
    padding: 10px 20px;
    margin: 10px 10px 0;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }

  .bottom-part {
    margin-top: 20px;
    text-align: right;
  }

  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .input-class {
    display: inline-block;
    width: 150px;
    margin-left: 10px;
  }

  .form {
    margin: 0 auto;
  }

</style>
