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
        <h3 class="login-title">讲解机器人电子后台管理系统</h3>
        <Form
          ref="formInline"
          :model="formInline"
          :rules="ruleInline"
          @submit.native.prevent
        >
          <FormItem prop="user">
            <Input
              type="text"
              v-model="formInline.user"
              placeholder="Username"
              size="large"
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
              placeholder="password"
              size="large"
            >
            <Icon
              type="ios-lock-outline"
              slot="prepend"
            ></Icon>
            </Input>
          </FormItem>
          <FormItem prop="code"  class="messImg">
            <Input
              type="text"
              v-model="formInline.code"
              placeholder="请输入验证码"
              size="large"
              @keyup.enter.native="handleSubmit('formInline')"
            
            >
            <img :src="this.message" alt="" slot="append" @click="getImgMessage" >
            </Input>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              @click="handleSubmit('formInline')"
              long
              :disabled="loading"
            >{{loginMsg}}</Button>
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
    var validatePass3 = (rule, value, callback) => {
      
      if (!value) {
        callback(new Error("请输入账号"));
      } else if (value.length<5) {
        callback(new Error("账号不可少于5位字符"));
      } else {
        callback();
      }
    };
    return {
      checked: true,
      disabled: false,
      loading: false,
      logo: "./static/img/logo.png",
      message: "",
      rud:'',
      loginMsg: "登录",
      formInline: {
        user: "",
        password: ""
      },
      ruleInline: {
        user: [{ required: true, validator: validatePass3, trigger: "blur" }],
        code: [{ required: true, message: '请填写验证码', trigger: "blur" }],
        password: [
          {
            required: true,
            message: "Please fill in the password.",
            trigger: "blur"
          },
          {
            type: "string",
            min: 4,
            message: "The password length cannot be less than 6 bits",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.getImgMessage()
  },
  methods: {
    // 获取图片验证码
    getImgMessage(){
      this.$axios.get('/management/sysuser/getCodeImg',{
          responseType: 'arraybuffer'
        }).then(res=>{
        if(res.status==200){
          console.log(res)
          this.message = 'data:image/png;base64,' + btoa(
            new Uint8Array(res.data)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          console.log(this.message)
          this.rud = res.headers.rud
        }
      })
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.loading=true
          this.loginMsg = "登录中..."
          this.$axios
            .post(
              "/management/sysuser/login",
              this.$qs.stringify({
                loginName: this.formInline.user,
                password: this.formInline.password,
                code: this.formInline.code,
                uid:this.rud
                
              })
            )
            .then(res => {
              console.log(res);
              if (res.status == 200) {
                if (res.data.code == 200) {
                  this.$Message.success("Success!");
                  sessionStorage.setItem("token", res.data.data.authStr);
                  sessionStorage.setItem(
                    "userName",
                    res.data.data.sysUser.nickName
                  );
                  sessionStorage.setItem("id", res.data.data.sysUser.id);
                    // sessionStorage.setItem("permissionList", JSON.stringify(res.data.data.permissionList));
                  this.$router.push("/");
                 
                } else {
                  this.$Message.error(res.data.msg);
                  this.loading=false
                }
              } else {
                this.$Message.error("服务器链接失败");
                this.loading=false
              }
            }).catch(e=>{
              this.$Message.error("服务器链接失败");
              this.getImgMessage()
                this.loading=false
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    sendCode() {
     if(this.formInline.user){
        this.$axios
        .post(`/management/sysuser/sendSMS?phone=${this.formInline.user}`)
        .then(res => {
          if (res.status == 200) {
            console.log(res);
            this.formInline.password = res.data.data
             this.$Notice.open({
                    title: '手机验证码',
                    desc: res.data.data,
                    duration: 0
                });
            var count = 60;
            this.message ="(" + count + ")" +"后重新发送";
            var timeCount = setInterval(() => {
              count = count - 1;
              this.message = "(" + count + ")" +"后重新发送";
              this.disabled = true;
              if (count == 0) {
                this.message = "获取验证码";
                clearInterval(timeCount);
                this.disabled = false;
              }
            }, 1000);
          }
        });
     }else{
       this.$Message.warning('请输入手机号')
     }
    }
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
  padding: 20px;
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
  width: 80px;
  height: 34px;
  display: block;
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
.login-title {
  text-align: center;
  margin-bottom: 20px;
}
.ivu-input-group-large .ivu-input, .ivu-input-group-large>.ivu-input-group-append, .ivu-input-group-large>.ivu-input-group-prepend:nth-of-type(2){
  padding: 0
}
</style>