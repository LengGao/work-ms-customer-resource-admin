<template>
<div class="list-container">
  <div class="nav-header">
    <span style="font-size: 14px; font-weight: 700;">资源批次管理</span>
    <el-input v-model="formInline.batchId" placeholder="批次编号" class="input-class"></el-input>
    <el-input v-model="formInline.batchName" placeholder="批次名称" class="input-class"></el-input>
    <el-select v-model="formInline.matchStatus" placeholder="匹配状态" class="input-class">
      <el-option
        v-for="item in matchStateArr"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select v-model="formInline.cashOutStatus" placeholder="提现状态" class="input-class">
      <el-option
        v-for="item in withdrawStateArr"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-button type="primary" style="margin-left: 10px;" @click="searchBatch">查询</el-button>
    <el-button style="margin-left: 10px;" @click="resetFn">重置</el-button>

    <div class="right-part">
      <el-button type="primary" style="margin-left: 10px;" @click="resourceSearch">资源查询</el-button>
      <el-button type="primary" style="margin-left: 10px;" @click="importResource">导入匹配</el-button>
    </div>
  </div>
  <el-table
    class="table-container"
    :data="tableData"
    border
    :height="tableHeight"
    :row-style="{height: '65px'}"
    :cell-style="{textAlign: 'center'}"
    style="width: 100%; overflow: auto;"
    >
    <el-table-column
      prop="batchId"
      align="center"
      label="批次编号"
      >
    </el-table-column>
    <el-table-column
      prop="batchName"
      align="center"
      label="批次名称"
      width="250">
    </el-table-column>
    <el-table-column
      prop="batchNum"
      align="center"
      label="批次数量"
      >
    </el-table-column>
    <el-table-column
      prop="newNum"
      align="center"
      label="新生数量"
      >
    </el-table-column>
    <el-table-column
      prop="matchTime"
      align="center"
      label="匹配时间"
      >
    </el-table-column>
    <el-table-column
      prop="matchState"
      align="center"
      label="匹配状态"
      >
    </el-table-column>
    <el-table-column
      prop="cashOutState"
      align="center"
      label="提现状态"
      >
    </el-table-column>
    <el-table-column
      label="操作"
      align="center"
    >
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="middle">查看</el-button>
        <el-button type="text" size="middle" @click="downloadBatch(scope.row)">下载</el-button>
        <el-button type="text" size="middle" @click="handleEdit(scope.row)" v-if="scope.row.cashOutState !== '已申请提现'">提现</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="bottom-part">
    <div class="pagination-wrap">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
    </div>
  </div>
  <!--资源匹配模态框-->
  <el-dialog :visible.sync="matchVisible" title="资源查询">
        <el-input v-model="searchNumber" placeholder="输入手机号码" style="display: inline-block; width: 300px;"
                  onkeyup="this.value=this.value.replace(/[^\d]/g,'');"></el-input>
        <el-button type="primary" style="margin-bottom: 15px;" @click="singleSearch">查询</el-button>
        <el-button type="info" style="margin-bottom: 15px;" @click="searchNumber = ''">重置</el-button>
        <div style="max-height: 500px; overflow-y: auto;">
          <el-table
            :data="matchTableData"
            stripe
          >
            <el-table-column
              prop="number"
              align="center"
              label="资源编号">
            </el-table-column>
            <el-table-column
              prop="name"
              align="center"
              label="资源名称">
            </el-table-column>
            <el-table-column
              prop="phone"
              align="center"
              label="手机号码">
            </el-table-column>
            <el-table-column
              prop="status"
              align="center"
              label="状态">
            </el-table-column>
          </el-table>
        </div>
        <div style="overflow: hidden;">
      <el-button class="close-match-wrap" @click="closeMatchWrap('matchVisible')">关闭</el-button>
    </div>
  </el-dialog>
  <!--导入匹配模态框-->
  <el-dialog :visible.sync="importVisible" title="导入匹配" ref="importWrap">
        <p class="caption-text">资源信息匹配根据手机号码进行匹配。<br/>
          如需导入匹配，请使用匹配模板，填完完毕后，再进行上传。<br/>
          导入的文件名称即为该次匹配操作的批次名称。
        </p>
        <div class="option-part">
          <div>
            <span style="display: inline-block; margin-right: 1em;">模 <i style="display: inline-block; width: 1.5em;"></i> 板:</span>
            <span style="margin-right: 2em;">匹配模板.xlsx</span>
            <el-button type="text" @click="downloadTemplate">下载</el-button>
          </div>
          <div style="position: relative; line-height: 35px;">
            <span class="match-file-text">匹配文件：</span>
            <el-upload
              class="upload-demo"
              ref="upload"
              action=""
              :limit="1"
              :multiple='false'
              list-type='text'
              :on-change="handleChange"
              :before-upload="beforeUpload"
              :on-exceed="handleExceed"
              :auto-upload="false"
              :http-request="uploadFile"
            >
              <el-button slot="trigger" size="small" type="primary" class="select-btn">选取文件</el-button>
            </el-upload>
          </div>
        </div>
        <div class="import-bottom">
          <el-button type="primary"  style="margin-left: 10px;" @click="$refs.upload.submit();">开始匹配</el-button>
          <el-button @click="closeMatchWrap('importVisible')">关闭</el-button>
        </div>
      <!--<div class="marching-wrap" ref="matchingWrap" style="display: block;">
        <h3>导入匹配</h3>
        <p style=" margin-top: 60px; font-size: 20px; text-indent: 2em;">系统处理中，请稍等...</p>
      </div>
      <div class="matched-wrap" ref="matchedWrap">
        <h3>提示</h3>
        <p style="margin-top: 20px; font-size: 16px; text-indent: 1em;">匹配结束</p>
        <p style="margin-top: 30px; font-size: 16px; text-indent: 1em;">共{{matchResult.total}}条数据，匹配成功{{matchResult.successNumber}}条，失败{{matchResult.failNumber}}条。</p>
        <p class="matched-bottom">
          <el-button type="info" @click="closeMatchWrap('importVisible')">关闭</el-button>
          <el-button type="primary" @click="downloadBatch(matchResult)">下载</el-button>
        </p>
      </div>-->
  </el-dialog>
  <!--导入匹配中-->
  <el-dialog :visible.sync="matchingVisible" title="导入匹配" width="40%">
    <p style="margin: 0 0 30px; font-size: 20px; text-indent: 2em;">系统处理中，请稍等..</p>
  </el-dialog>
  <!--导入已完成-->
  <el-dialog :visible.sync="matchedVisible" title="提示" width="40%" class="matched-wrap">
      <p style="margin-top: -20px; font-size: 16px; text-indent: 1.5em;">匹配结束</p>
      <p style="margin-top: 30px; font-size: 16px; text-indent: 1.5em;">共{{matchResult.total}}条数据，匹配成功{{matchResult.successNumber}}条，失败{{matchResult.failNumber}}条。</p>
      <p class="matched-bottom">
        <el-button type="primary" @click="downloadBatch(matchResult)">下载</el-button>
        <el-button type="info" @click="closeMatchWrap('matchedVisible')">关闭</el-button>
      </p>
  </el-dialog>
</div>
</template>

<script>
import resourceBatchApi from '@/api/resourceBatch'
import { validPhoneNumber } from '@/utils/validate'
// import { loginUrl } from '../../baseData'

export default {
  name: 'resourceBatch',
  data () {
    return {
      allTableData: [],
      tableData: [
        // {
        //   batchId: '315643134',
        //   batchName: '2020年01月项目合作',
        //   batchNum: '50',
        //   newNum: '10',
        //   matchTime: '2020-01-01 10:00:00',
        //   matchState: '已匹配',
        //   cashOutState: '未提现'
        // }
      ],
      formInline: {
        batchId: '',
        batchName: '',
        matchStatus: '',
        cashOutStatus: ''
      },
      matchStateArr: [
        {
          value: '1',
          label: '已匹配'
        }
      ],
      withdrawStateArr: [
        {
          value: '1',
          label: '已申请提现'
        }, {
          value: '0',
          label: '待提现'
        }
      ],
      currentPage4: 1,
      matchVisible: false, // 匹配资源模态框
      importVisible: false, // 导入资源模态框
      searchNumber: '',
      matchTableData: [
      ],
      withdrawTag: true,
      tableHeight: null, // 表格高度
      pageNum: 1, // 表格页数
      pageSize: 10, // 每页的数量
      totalNum: null,
      matchResult: {
        total: '',
        successNumber: '',
        failNumber: '',
        id: null
      },
      matchingVisible: false, // 导入匹配中
      matchedVisible: false // 导入完成
    }
  },
  methods: {
    // 设置每页多少条数据
    handleSizeChange (val) {
      if (this.pageNum !== 1) {
        this.pageSize = val * 1
        return
      }
      if (this.totalNum > this.pageSize || this.totalNum > val * 1) {
        this.pageSize = val * 1
        resourceBatchApi.getResourceList(this.dealWithParams()).then(res => {
          this.allTableData = res.rows
          this.totalNum = res.total * 1
          // console.log(this.allTableData)
          // 处理allTableData
          this.dealWithData(this.allTableData)
        })
      } else {
        this.pageSize = val * 1
      }
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pageNum = val * 1
      resourceBatchApi.getResourceList(this.dealWithParams()).then(res => {
        this.allTableData = res.rows
        this.totalNum = res.total * 1
        // console.log(this.allTableData)
        // 处理allTableData
        this.dealWithData(this.allTableData)
      })
    },
    handleClick (row) { // 点击查看
      // console.log(row)
      this.$router.push({
        path: '/resource/resourcesList',
        query: {
          batchId: row.batchId,
          id: row.id
        }
      })
    },
    // 关闭资源匹配框
    closeMatchWrap (params) {
      this[params] = false
      if (params === 'matchVisible') {
        this.matchTableData = []
        this.searchNumber = ''
      }
      if (params === 'importVisible' || params === 'matchedVisible') {
        this.matchResult = {
          total: '',
          successNumber: '',
          failNumber: '',
          id: null
        }
      }
    },
    handleChange (file, fileList) {
      const isText = file.raw.type === 'application/vnd.ms-excel'
      const isTextComputer = file.raw.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      // console.log(isText || isTextComputer)
      const textTag = (isText || isTextComputer)
      if (!textTag) {
        this.$message.warning('请提交Excel表')
      } else {
        this.$message.info('文件：' + file.name + '上传成功')
      }
    },
    // 上传文件前钩子函数
    beforeUpload (file) {
      // console.log('beforeUpload')
      // console.log(file.type)
      const isText = file.type === 'application/vnd.ms-excel'
      const isTextComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const textTag = (isText || isTextComputer)
      if (!textTag) this.$message.warning('请提交Excel表')
      return (isText || isTextComputer)
    },
    // 上传文件个数超过定义的数量
    handleExceed (files, fileList) {
      this.$message.warning('当前限制选择 1 个文件，请删除后继续上传')
    },
    // 上传文件
    uploadFile (item) {
      // console.log(item)
      // console.log(123)
      const fileObj = item.file
      // console.log(fileObj)
      // FormData 对象
      const params = new FormData()
      // 文件对象
      params.append('file', fileObj)
      // console.log(JSON.stringify(params))
      this.importVisible = false // 隐藏导入框
      this.matchingVisible = true // 显示正在匹配框
      resourceBatchApi.importMatch(params).then(response => {
        // console.log(response)
        this.matchResult = response
        this.matchingVisible = false
        this.matchedVisible = true
      }).catch(() => {
        this.importVisible = true
        this.matchingVisible = false
      })
    },
    // 重置搜索框
    resetFn () {
      this.formInline = {
        batchNumber: '',
        batchName: '',
        matchState: '',
        cashOutState: ''
      }
    },
    // 表格编辑函数
    handleEdit (row) { // 提现
      // console.log(row)
      resourceBatchApi.cashOutBatch({
        id: row.id
      }).then(res => {
        console.log(res)
        if (res === '操作成功') {
          row.cashOutState = '已申请提现'
          this.$message.success(res)
        }
      })
    },
    dealWithData (array) { // 处理匹配状态和提现状态
      if (array.length !== 0) {
        array.map(value => {
          value.matchState = value.matchState === 0 ? '匹配异常' : '已匹配'
          value.cashOutState = value.cashOutState === 0 ? '待提现' : '已申请提现'
          // console.log(value)
        })
      }
      this.tableData = this.allTableData
      const dataNum = this.tableData && this.tableData.length
      if (dataNum > 10) { // 设置表格最大高度
        this.tableHeight = 713
      } else {
        // console.log(1)
        this.tableHeight = null
      }
    },
    dealWithParams () {
      const obj = this.formInline
      const params = {}
      // console.log(obj)
      for (const i in obj) {
        // console.log(i, obj[i])
        if (obj[i] !== '') {
          params[i] = obj[i]
        }
      }
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      return params
    },
    // 初始化数据
    initData () {
      resourceBatchApi.getResourceList({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        this.allTableData = res.rows
        this.totalNum = res.total * 1
        // console.log(this.allTableData)
        // 处理allTableData
        this.dealWithData(this.allTableData)
        // this.allTableData.map(value => {
        //   value.matchState = value.matchState === 0 ? '未匹配' : '已匹配'
        //   value.cashOutState = value.cashOutState === 0 ? '未提现' : '已提现'
        //   // console.log(value)
        // })
      })
    },
    // 查询批次
    searchBatch () {
      resourceBatchApi.getResourceList(this.dealWithParams()).then(res => {
        this.allTableData = res.rows
        this.totalNum = res.total * 1
        this.dealWithData(this.allTableData)
      })
    },
    // 下载excel模板
    downloadTemplate () {
      // console.log(1)
      resourceBatchApi.downloadTemplate().then(res => {
        const fileName = (res.headers['content-disposition'].split('filename=')[1])
        var decodeFileName = fileName.split('.')[0]
        decodeFileName = decodeURIComponent(decodeFileName.trim())
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
        // console.log(res)
      })
    },
    // 单个查询
    singleSearch () {
      // 13900000269
      if (!this.searchNumber) {
        this.$message.warning('号码不能为空')
        return
      }
      if (!validPhoneNumber(this.searchNumber)) {
        this.$message.warning('输入正确号码')
        return
      }
      resourceBatchApi.singleSearch({
        phone: this.searchNumber
      }).then(res => {
        console.log(res)
        // 处理数据
        this.matchTableData = res
        this.matchTableData.map(val => {
          if (!val.number) val.number = '-'
          if (!val.name) {
            val.name = '-'
          }
          (val.status * 1) === 0
            ? val.status = '新生'
            : val.status = '在读生'
        })
      })
    },
    // 下载批次
    downloadBatch (row) {
      if (!row.id) return
      resourceBatchApi.downloadBatch({
        id: row.id
      }).then(res => {
        // console.log(res)
        const fileName = (res.headers['content-disposition'].split('filename=')[1])
        var decodeFileName = fileName.split('.')[0]
        decodeFileName = decodeURIComponent(decodeFileName.trim())
        // console.log(decodeFileName)
        // msword pdf zip application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
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
    // 导入匹配
    importResource () {
      // 清空匹配数据
      this.matchResult = {
        total: '',
        successNumber: '',
        failNumber: '',
        id: null
      }
      // 清空上传的文件
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
      // 打开模态框
      this.importVisible = true
    },
    // 资源查询
    resourceSearch () {
      this.matchTableData = []
      this.searchNumber = ''
      this.matchVisible = true
    }
  },
  mounted () {
    this.initData()
  }
}
</script>

<style scoped>
.list-container {
  position: relative;
  max-height: 850px;
  padding: 10px 20px;
  margin: 10px 10px 0;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.table-container {
  box-sizing: border-box;
}

.nav-header {
  margin-bottom: 20px;
  overflow: hidden;
}

.right-part {
  float: right;
}

.bottom-part {
  margin-top: 20px;
  text-align: right;
}

.input-class {
  display: inline-block;
  width: 150px;
  margin-left: 10px;
}

.close-match-wrap {
  float: right;
  width: 200px;
  margin-top: 15px;
}

.caption-text {
  padding-left: 1em;
  margin-top: -20px;
  line-height: 32px;
}

.option-part {
  width: 95%;
  width: -moz-calc(100% - 2em);
  width: -webkit-calc(100% - 2em);
  width: calc(100% - 2em);
  min-height: 125px;
  padding: 9px 0 9px 2em;
  margin: 0 1em;
  background: rgba(242, 242, 242, 1);
  border: 1px solid rgba(204, 204, 204, 1);
  box-sizing: border-box;
}

.upload-demo {
  position: relative;
  display: inline-block;
  width: 300px;
  min-height: 89px;
  padding-left: 5.5em;
  box-sizing: border-box;
}

.match-file-text {
  position: absolute;
  bottom: 13px;
  left: 0;
}

.select-btn {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 8px;
}

.import-bottom {
  margin: 1em 1em  0 0;
  overflow: hidden;
}

.import-bottom > button {
  float: right;
  margin-left: 10px;
}

.matched-bottom {
  margin-top: 25px;
  overflow: hidden;
}

.matched-bottom > button {
  float: right;
  margin-left: 10px;
}
</style>
