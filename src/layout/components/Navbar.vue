<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened"
               class="hamburger-container"
               @toggleClick="toggleSideBar" />

<!--    <breadcrumb class="breadcrumb-container" />-->

    <div class="right-menu">
      <el-dropdown class="avatar-container"
                   trigger="click">
        <div class="avatar-wrapper">
          <img src="@/assets/logo_header.png"
               class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
          <el-dropdown-menu slot="dropdown"
                            class="user-dropdown"
                            style="margin-top: -10px;"
          >
            <router-link to="/">
              <el-dropdown-item>
                首页
              </el-dropdown-item>
            </router-link>
            <!-- <a target="_blank"
                href="https://github.com/PanJiaChen/vue-admin-template/">
               <el-dropdown-item>Github</el-dropdown-item>
             </a>
             <a target="_blank"
                href="https://panjiachen.github.io/vue-element-admin-site/#/">
               <el-dropdown-item>Docs</el-dropdown-item>
             </a>-->
            <el-dropdown-item divided>
            <span style="display: block;"
                  @click="logout">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    // Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout () {
      await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  position: relative;
  height: 50px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    float: left;
    height: 100%;
    line-height: 46px;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      height: 100%;
      padding: 0 8px;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        margin-top: 5px;

        .user-avatar {
          width: 40px;
          height: 40px;
          cursor: pointer;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          position: absolute;
          top: 25px;
          right: -20px;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
