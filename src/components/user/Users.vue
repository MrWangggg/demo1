<template>
  <div>
  <!-- 面包屑导航区域 separator为分隔符-->
  <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图 -->
<el-card>
  <!-- 搜索与添加区域 -->
  <el-row :gutter="20">
    <el-col :span="9">
      <el-input placeholder="请输入内容" v-model="userInfo.query" clearable @clear="getUserList">
        <el-button slot="append" icon="el-icon-search"  @click="getUserList"></el-button>
      </el-input>
    </el-col>
    <el-col :span="4">
      <el-button type="primary" @click="adddialogVisible = true">添加用户</el-button>
    </el-col>
  </el-row>
</el-card>
<!-- 用户列表区域 -->
<el-table :data="userlist" border stripe>
  <el-table-column type="index" label="#"></el-table-column>
  <el-table-column label="姓名" prop="username"></el-table-column>
  <el-table-column label="邮箱" prop="email"></el-table-column>
  <el-table-column label="电话" prop="mobile"></el-table-column>
  <el-table-column label="角色" prop="role_name"></el-table-column>
  <el-table-column label="状态" prop="mg_state">
    <!-- <template slot-scope="scope"> {{ scope.row. }} 作用域插槽获取每一行的数据-->
    <template slot-scope="scope">
      <!-- {{ scope.row.mg_state }} -->
      <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="userMgStateChanged(scope.row)">
      </el-switch>
    </template>
  </el-table-column>
  <el-table-column label="操作" width="180px">
    <template slot-scope="scope">
      <!-- 编辑信息 -->
       <el-tooltip  effect="dark" content="编辑信息" placement="top" :enterable='false'>
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
       </el-tooltip>
      <!-- 删除信息 -->
      <el-tooltip  effect="dark" content="删除信息" placement="top" :enterable='false'>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
      </el-tooltip>
      <!-- 分配角色 -->
      <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable='false'>
      <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
    </el-tooltip>
    </template>
  </el-table-column>
</el-table>
<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="userInfo.pagenum"
:page-sizes="[1, 2, 5, 10]" :page-size="userInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
</el-pagination>
  <!-- 添加角色信息弹出框 -->
<el-dialog title="添加用户" :visible.sync="adddialogVisible" width="30%" @close='addDialogClosed'>
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="auto">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="电话" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="adddialogVisible = false">
      取 消
    </el-button>
    <el-button type="primary" @click="addUsers">
      确 定
    </el-button>
  </span>
</el-dialog>
<!-- 修改用户的对话框 -->
<el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="auto">
  <el-form-item label="用户名">
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>

</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  // 定义data 表示组件私有数据
  data () {
    // 验证邮箱
    var checkEmail = (rule, value, cb) => {
      // regEmail 验证邮箱的正则表达式
      const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      // 判断输入的邮箱是否和regEmail 匹配
      if (regEmail.test(value)) {
        return cb()
      } else {
        cb(new Error('请输入合法的邮箱'))
      }
    }
    // 验证手机号
    var checkmobile = (rule, value, cb) => {
      // regMobile验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

    return {
      // 获取用户列表的参数对象
      userInfo: {
        // 搜索框数去的内容
        query: '',
        // 当前页码
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 控制添加用户弹出框的隐藏与显示
      adddialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        // trigger 规则判断时间 blur失去焦点时判断
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '请输入3~10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '请输入6~15个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请填写电子邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请填写电话', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户弹出框的隐藏与显示
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {
        //
      },
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请填写电子邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请填写电话', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ]
      }
    }
  },
  // 生命周期函数
  created () {
    this.getUserList()
  },
  // 定义组件数据处理函数
  methods: {
    async getUserList () {
      // get对象使用params
      const { data: res } = await this.$http.get('users', { params: this.userInfo })
      if (res.meta.status !== 200) {
        return this.$Message.error('获取管理员列表失败')
      }
      this.userlist = res.data.users
      this.total = res.data.total
      // console.log(res)
    },
    // 监听 userInfo.pagesize 改变事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.userInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听当前页码 userInfo.pagenum
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.userInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听 switch 开关状态
    async userMgStateChanged (userInfo) {
      // console.log(userInfo)
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$Message.error('更新用户状态失败！')
      } else {
        this.$Message.success('更新用户状态成功！')
      }
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定，添加新用户
    addUsers () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        // 判断是否添加用户成功
        if (res.meta.status !== 201) {
          return this.$Message.error('用户添加失败')
        } else {
          this.$Message.success(res.meta.msg)
          // 关闭添加用户的弹出框
          this.adddialogVisible = false
          // 重新获取用户列表
          this.getUserList()
        }
      })
    },
    // 展示编辑的对话框
    async showEditDialog (id) {
      // console.log(id)
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$Message.error('查询用户信息失败！')
      } else {
        this.$Message.success(res.meta.msg)
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // 发起修改用户的请求
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          return this.$Message.error('更新用户信息失败！')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新用户列表
        this.getUserList()
        // 提示修改成功
        this.$Message.success('更新用户信息成功！')
      })
    },
    // 根据id删除对应信息
    async removeUserById (id) {
      // 弹窗询问客户是否删除数据
      const ConFirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认，侧返回值为字符串 ConFirm
      // 如果用户取消，则返回值为字符串 cancel
      // console.log(ConFirmResult)
      if (ConFirmResult !== 'confirm') {
        return this.$Message.info('已取消删除')
      }
      // console.log('已确认删除')
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$Message.error('删除用户失败')
      } else {
        this.getUserList()
        this.$Message.success(res.meta.msg)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;font-size: 14px;
}
.el-card{
  // box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.15)!important;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)!important
}
.el-table{
  margin-top: 20px;
  font-size: 13px;
  align-items: center;
}
.el-table th>.cell{
  text-align: center!important}
.el-pagination{
  margin-top: 15px;
}
</style>
