<template>
   <div id="app">
     <router-view/>
   </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
  text-decoration: none;
  list-style: none
}
html,body,#app{
  height: 100%;
  font-size: 14px;
  font-family: PingFangSC-Regular;
}
input, textarea, select, button {
  font-family: PingFangSC-Regular;
}
.ivu-layout-content{
  position: relative;
  padding-bottom: 40px !important;
}
.el-upload-list__item {
      transition: none !important;
    }
.page-change{
position: absolute;
right: 0;
bottom: 0;
}
.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 120px;
    color: #99a9bf !important;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .upload .el-upload--picture-card {
	display: none;
}
</style>
