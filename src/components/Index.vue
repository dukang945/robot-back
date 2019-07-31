<template>
  <div class="layout">
    <Layout style="height:100%">
      <Header>
          <div class="user-msg">
            <span>{{userName}}</span>
            <Button type="text" @click="logOut">退出</Button>
          </div>
      </Header>
      <Layout>
        <Sider
          hide-trigger
          :style="{background: '#fff'}"
        >
          <Menu
            :active-name="$route.fullPath"
            theme="light"
            width="auto"
            :open-names="['1']"
          >
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>
                固件管理
              </template>
              <MenuItem
                name="/Upload"
                to='Upload'
              >固件信息</MenuItem>
              <MenuItem
                name="/History"
                to='History'
              >上传记录</MenuItem>
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                <Icon type="ios-contact-outline" />
                账号管理
              </template>
              <MenuItem
                name="/Role"
                to='Role'
              >角色信息</MenuItem>
              </Submenu>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Breadcrumb :style="{margin: '24px 0'}">
          </Breadcrumb>
          <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
            <router-view></router-view>
          </Content>
        </Layout>
      </Layout>
    </Layout>
    
  </div>
</template>

<script>
export default {
  data () {
    return {
      userName:sessionStorage.getItem('userName')
    }
  },
  mounted() {
    console.log(this.$route)
  },
  methods: {
    logOut(){
      this.$axios.post('/management/sysAccount/logout',this.$qs.stringify({
        userId:sessionStorage.getItem('id')
      })).then(res=>{
        sessionStorage.clear();
              this.$router.push("/Login");
      })  
    }
  }
};
</script>

<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  height: 100%;
}
.layout-logo {
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
.layout-footer-center {
  text-align: center;
}
.user-msg{
  text-align: right;
  color: #fff;
}
.user-msg button{
  margin-top: -5px;
  color: #fff;
}
.user-msg button:hover{
  background-color: #515a6e;
}
</style>