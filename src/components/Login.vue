<template>
  <div class="login-wrap">
    <img
      src="../assets/images/bg2.png"
      alt=""
      class="bg2"
    >
    <div class="ms-login">
      <img
        src="../assets/images/logo.png"
        alt
      >
      <div class="login-box">
        <Form
          ref="formInline"
          :model="formInline"
          :rules="ruleInline"
        >
          <FormItem prop="user">
            <Input
              type="text"
              v-model="formInline.user"
              placeholder="Username"
            >
            <Icon
              type="ios-person-outline"
              slot="prepend"
            ></Icon>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input
              type="password"
              v-model="formInline.password"
              placeholder="Password"
            >
            <Icon
              type="ios-lock-outline"
              slot="prepend"
            ></Icon>
            </Input>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              @click="handleSubmit('formInline')"
              long
            >登录</Button>
          </FormItem>
        </Form>

      </div>
    </div>
  </div>
</template>

<script>
// import store from "../../vuex/vuex.js";
export default {
  data: function() {
    return {
      checked: true,
      logo: "./static/img/logo.png",
      formInline: {
        user: "",
        password: ""
      },
      ruleInline: {
        user: [
          {
            required: true,
            message: "Please fill in the user name",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "Please fill in the password.",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "The password length cannot be less than 6 bits",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
            this.$axios.post('/management/sysAccount/login',this.$qs.stringify({
                loginAccount:this.formInline.user,
                loginPassword:this.formInline.password
            })).then(res=>{
                console.log(res)
                if (res.status == 200) {
                if (res.data.code == 200) {
                     this.$Message.success("Success!");
                  sessionStorage.setItem("token", res.data.data.authStr);
                  sessionStorage.setItem("userName", res.data.data.sysAccount.realName);
                  sessionStorage.setItem("id", res.data.data.sysAccount.id);
                //   sessionStorage.setItem("permissionList", JSON.stringify(res.data.data.permissionList));
                  this.$router.push("/");
                //   if (this.checked) {
                //     this.setCookie(
                //       this.ruleForm.username,
                //       this.ruleForm.password,
                //       30
                //     );
                //   } else {
                //     this.clearCookie();
                //   }
                } else {
                  this.$Message.error("账号或密码错误!");
                }
              } else {
                this.$Message.error("服务器链接失败");
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
            })
         
        
    },
  }
};
</script>

<style>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #7fb8fc;
  /* background: url("../assets/images/bg.png") no-repeat; */
}
.bg2 {
  position: absolute;
  width: 600px;
  left: 10%;
  top: 20%;
}
.login-box {
  border-radius: 5px;
  box-shadow: 0px 4px 4px 0px rgba(31, 138, 61, 0.35);
  overflow: hidden;
  background: #fff;
  padding: 20px
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  margin-top: 16px;
  color: #303133;
}
.ms-login {
  position: absolute;
  right: 17%;
  top: 48%;
  transform: translateY(-50%);
  width: 365px;
  border-radius: 5px;
}
.ms-login img {
  width: 240px;
  display: block;
  margin-bottom: 40px;
  margin-left: 70px;
}
.ms-content {
  padding: 16px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
  background-color: #7ca4ff;
  border-color: #7ca4ff;
  margin-bottom: 16px;
}
.ms-login .el-form-item__label {
  color: #c0c4cc !important;
}
.ms-login .el-input__inner:focus,
.ms-login .el-input__inner {
  border-color: #b8cdfd;
}
.password {
  margin-top: -15px !important;
  margin-bottom: 30px !important;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
.username-rem {
  display: flex;
  justify-content: space-between;
}
.username-rem .el-checkbox__label {
  padding: 0;
}
.el-checkbox__inner {
  border-radius: 50%;
}
</style>