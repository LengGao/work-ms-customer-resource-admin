<template>
  <div class="user-management">
    <el-form ref="form"
             :model="form"
             :rules="rulesSearchForm"
             inline>
      <el-form-item label="用户管理"
                    ></el-form-item>
      <el-form-item prop="id">
        <el-input placeholder="用户编号"
                  class="input-class"
                  v-model="form.id" />
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
      <el-form-item prop="role">
        <el-select v-model="form.role"
                   class="input-class"
                   placeholder="权限">
          <el-option label="内部用户"
                     value="内部用户"></el-option>
          <el-option label="外部用户"
                     value="外部用户"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="form.status"
                   class="input-class"
                   placeholder="状态">
          <el-option label="有效"
                     value="0"></el-option>
          <el-option label="无效"
                     value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-left: 20px;"  >
        <el-button type="primary"
                   @click="submitForm('form')">查询</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
      <el-button style="float: right;" type='primary' @click="addValue">新增用户</el-button>
    </el-form>
    <el-table :data="tableData"
              border
              style="width: 100%;"
              :row-style="{height: '65px'}"
              :cell-style="{textAlign: 'center'}">
      <el-table-column
                       prop="id"
                       align="center"
                       label="用户编号"
                       :formatter="formatterId"
                       ></el-table-column>
      <el-table-column prop="phone"
                       align="center"
                       label="手机号码"
                       ></el-table-column>
      <el-table-column prop="name"
                       align="center"
                       label="姓名"
                       ></el-table-column>
      <el-table-column prop="role"
                       align="center"
                       label="权限"
                       ></el-table-column>
      <el-table-column prop="status"
                       align="center"
                       label="状态"
                       :formatter="formatter"></el-table-column>
      <el-table-column label="操作"
                       align="center"
                       >
        <template slot-scope="scope">
          <el-button @click.native.prevent="modifyData(scope.$index, tableData)"
                     type="text"
                     size="middle">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottom-part">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="currentPage"
                     :page-sizes="[10, 20, 50, 100]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"></el-pagination>
    </div>
    <el-dialog title='详情'
               :visible.sync="isWatch">
      <el-form ref="detailData"
               :model="detailData"
               :rules="rulesModifyForm"
               label-width="120px"
               inline>
        <el-form-item label="用户编号："
                      prop="id">
          <el-input type="text" :value='result.value' :disabled="true" />
          <el-input  type="hidden" v-model="detailData.id"
                    :disabled="true" style="position: absolute;" />
        </el-form-item>
        <el-form-item label="状态："
                      prop="status">
          <el-select v-model="detailData.status"
                     placeholder="状态">
            <el-option v-for="(item,index) in options"
                       :key="index"
                       :value="item.value"
                       :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码："
                      prop="phone">
          <el-input type="phone"
                    v-model.number="detailData.phone"
                    placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="姓名："
                      prop="name">
          <el-input v-model="detailData.name"
                    placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item prop="role"
                      label="角色：">
          <el-select v-model="detailData.role"
                     placeholder="角色">
            <el-option label="内部用户"
                       value="内部用户"></el-option>
            <el-option label="外部用户"
                       value="外部用户"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="receiveNotification"
                      style="margin-left: 80px;">
          <el-checkbox v-model="detailData.receiveNotification"
                       :true-label='1' :false-label='0'>
                        是否接受业务通知
          </el-checkbox>
        </el-form-item>
      </el-form>
      <el-row type="flex"
              justify="end">
        <el-button @click="cancel('detailData')">取消</el-button>
        <el-button type="primary"
                   @click="modify('detailData')">修改</el-button>
      </el-row>
    </el-dialog>
    <el-dialog title='新增用户'
               :visible.sync="isAdd">
      <el-form ref="addData"
               :model="addData"
               :rules="rules"
               label-width="120px"
               inline>
        <el-form-item label="用户编号："
                      prop="id">
          <el-input v-model="addData.id"
                    :disabled="true"
                    />
        </el-form-item>
        <el-form-item label="状态："
                      prop="status">
          <el-select v-model="addData.status"
                     placeholder="状态">
            <el-option :label="'有效'"
                       :value="1"></el-option>
            <el-option :label="'无效'"
                       :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码："
                      prop="phone">
          <el-input type="phone"
                    v-model.number="addData.phone"
                    placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="姓名："
                      prop="name">
          <el-input v-model="addData.name"
                    placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item prop="role"
                      label="角色：">
          <el-select v-model="addData.role"
                     placeholder="角色">
            <el-option label="内部用户"
                       value="内部用户"></el-option>
            <el-option label="外部用户"
                       value="外部用户"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="receiveNotification" style="margin-left: 80px;">
            <el-checkbox v-model="addData.receiveNotification"
                          :true-label='1' :false-label='0' >
            是否接受业务通知
            </el-checkbox>
          </el-form-item>
      </el-form>
      <el-row type="flex"
              justify="end">
        <el-button @click="cancel('addData')">取消</el-button>
        <el-button type="primary"
                   @click="add('addData')">新增</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { userList, user } from '@/api'
export default {
  name: 'userManagement',
  data () {
    const validateId = (rule, value, callback) => {
      if (value === '' || value == null) {
        callback()
      } else if ((/[`~!@#$^&*()=|{}':;',[\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%_]/.test(value))) {
        callback(new Error('请勿输入特殊字符'))
      } else if (!(/\d/.test(value))) {
        callback(new Error('请输入数字用户编号'))
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
        id: '',
        phone: '',
        name: '',
        role: '',
        status: ''
      },
      options: [
        { value: 1, label: '有效' },
        { value: 0, label: '无效' }
      ],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      isWatch: false,
      detailData: {
        id: '',
        phone: '',
        name: '',
        role: '',
        status: '',
        receiveNotification: ''
      },
      // 新增用户表单校验规则
      rules: {
        // id: [{ required: true, max: 6, message: '请输入0-6位', trigger: 'blur' }],
        name: [{ required: true, message: '请输入', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }],
        phone: [{ required: true, type: 'number', validator: validatePhone, trigger: 'blur' }],
        role: [{ required: true, message: '请选择', trigger: 'change' }],
        status: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      // 搜索用单校验规则
      rulesSearchForm: {
        id: [{ required: false, max: 6, message: '请输入0-6位的用户编号', trigger: 'change' },
          { validator: validateId, trigger: 'change' }],
        phone: [{ required: false, validator: validatePhone, trigger: 'change' }],
        name: [{ required: false, validator: validateName, trigger: 'change' }]
      },
      // 修改用户信息表单校验规则
      rulesModifyForm: {
        name: [{ required: true, message: '请输入', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }],
        phone: [{ required: true, type: 'number', validator: validatePhone, trigger: 'blur' }],
        role: [{ required: true, message: '请选择', trigger: 'change' }],
        status: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      isAdd: false,
      // 新增用户信息表单对象
      addData: {
        id: '',
        phone: '',
        name: '',
        role: '',
        status: '',
        receiveNotification: ''
      },
      // 用户角色信息
      role: '',
      // 修改用户ID自定义会回显对象
      result: {
        value: '',
        origin: ''
      }
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
    },
    addValue () {
      this.isAdd = !this.isAdd
    },
    // 详情查看 p1 number 在表格的索引 p2 object 表格数据对象
    modifyData (p1, p2) {
      console.log(p1, p2)
      this.isWatch = !this.isWatch
      const obj = JSON.parse(JSON.stringify(p2[p1]))
      this.detailData = obj
      const init = '000000'
      const id = String(obj.id)
      const result = init.substring(0, 6 - id.length) + id
      this.result.value = result
      this.result.origin = id
      console.log('detailData', this.detailData, this.result)
    },
    modify (formName) {
      // console.log('detailData2', this.$refs[formName])
      this.$refs[formName].validate(valid => {
        if (valid) {
          user(this.detailData).then(res => {
            this.isWatch = !this.isWatch
            this.initData()
          })
          // .catch(err => {
          //   this.$message.error('新增异常，请联系管理员' + err)
          // })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel (formName) {
      this.$refs[formName].resetFields()
      this.isAdd = false
      this.isWatch = false
    },
    add (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          user(this.addData).then(res => {
            this.isAdd = !this.isAdd
            this.initData()
            this.$refs[formName].resetFields()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 页面移动
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.currentPage = 1
      this.initData()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      // Number(val) + Number(this.pageSize)
      this.currentPage = Number(val)
      this.initData()
      console.log(`当前页ss: ${this.currentPage}`)
    },
    /**
       * option Object {id:'',phone:'',name:'',status:0, reule:''}
       */
    initData (option) {
      const pageNum = this.currentPage
      const pageSize = this.pageSize
      const obj = {}
      for (const key in option) {
        if (option[key] === '' || option[key] == null) {
          continue
        }
        obj[key] = option[key]
        console.log(obj)
      }
      // 发送请求
      const query = { pageNum, pageSize, ...obj }
      userList(query).then(res => {
        // console.log("res",res)
        this.tableData = res.rows
        this.total = Number(res.total)
      })
    },
    formatter (row, col) {
      return row.status === 1 ? '有效' : '无效'
    },
    formatterId (row, col) {
      const init = '000000'
      const id = String(row.id)
      const result = init.substring(0, 6 - id.length) + id
      return result
    }
  },
  created () {
    this.initData()
    // this.role = this.$store.state.user.roleObj.role  console.log('role', this.role)
    // 如果后续发现采用路由守卫方式有问题 则采用渲染不同页面元素的方式 mounted
  }
}
</script>
<style scoped>
  .user-management {
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
</style>
