<template>
<el-container class="homeContainer">
  <el-header>
    <div>
      <!-- <img src="" alt=""> -->
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
    </el-header>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="iscollapse ? '64px' :'200px'">
      <div class="toggleHead" @click="togglecollapse">|||</div>
      <!-- 侧边栏菜单 -->
      <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="iscollapse"
      :collapse-transition="false" router :default-active="activePath">
         <!-- 一级菜单 -->
        <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- i 为图标 span 为文本 -->
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+ subItem.path" v-for="subItem in item.children" :key="subItem.id"
            @click="saveNavState('/'+ subItem.path)">
              <template slot="title">
                <!-- i 为图标 span 为文本 -->
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
        </el-submenu>
      </el-menu>

    </el-aside>
    <!-- 右侧主题内容 -->
    <el-container>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
      <el-footer>Copyright © ********.cn All Rights Reserved.</el-footer>
    </el-container>
  </el-container>
</el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单区域
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      iscollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有菜单项
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },
    // 点击按钮， 切换菜单的折叠与展开
    togglecollapse () {
      this.iscollapse = !this.iscollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less">
.homeContainer{width:100%;height:100%}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0!important;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  color: #fff;
  .el-menu{border-right:none}
}
.el-main .el-footer {
  background-color: #eaedf1;
}
.el-footer{align-items:center;text-align: center;}
.iconfont{margin-right: 10px;}
.toggleHead{
  background-color:#4A5064;
  text-align:center;
  cursor: pointer;
}
</style>
