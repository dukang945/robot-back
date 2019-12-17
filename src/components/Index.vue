<template>
  <div class="layout">
    <Layout style="height:100%">
      <Header>
        <div class="user-msg">
          <span>{{userName}}</span>
          <Button
            type="text"
            @click="logOut"
          >退出</Button>
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
              <!-- <template slot="title">
                <Icon type="ios-navigate"></Icon>
                机器人管理
              </template> -->
              <!-- <MenuItem
                name="/Configuration"
                to='Configuration'
              >设备配置</MenuItem>
              <MenuItem
                name="/Directions"
                to='Directions'
              >问路</MenuItem>
              <MenuItem
                name="/Tutorials"
                to='Tutorials'
              >导览路线</MenuItem>

              <MenuItem
                name="/Meeting"
                to='Meeting'
              >迎宾</MenuItem>
              <MenuItem
                name="/Answer"
                to='Answer'
              >自定义问答</MenuItem>
              <MenuItem
                name="/Promotion"
                to='Promotion'
              >促销信息</MenuItem>
              <MenuItem
                name="/Map"
                to='Map'
              >地图信息</MenuItem>
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>
                账号管理
              </template> -->
              <MenuItem
                name="/Equipment"
                to='Equipment'
              >设备管理</MenuItem>
              <MenuItem
                name="/Organize"
                to='Organize'
              >组织管理</MenuItem>
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
  data() {
    return {
      userName: sessionStorage.getItem("userName")
    };
  },
  mounted() {
    console.log(this.$route);
  },
  methods: {
    logOut() {
      this.$axios
        .post(
          `/management/sysuser/logout?authStr=${sessionStorage.getItem(
            "token"
          )}`
        )
        .then(res => {
          sessionStorage.clear();
          this.$router.push("/Login");
        });
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
.user-msg {
  text-align: right;
  color: #fff;
}
.user-msg button {
  margin-top: -5px;
  color: #fff;
}
.user-msg button:hover {
  background-color: #515a6e;
}
</style>