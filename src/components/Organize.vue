<template>
  <div>
    <el-button
      type="primary"
      @click="dialogAddVisible = true"
    >新增</el-button>
    <el-button
      type="primary"
      @click="handleDelete"
    >批量删除</el-button>
    <Form
      ref="formInline"
      :model="formInline"
      inline
      style="float:right"
      @submit.native.prevent
    >

      <FormItem>
        <Input
          v-model="formInline.name"
          placeholder="组织名称"
          @keyup.enter.native="getData(1,10)"
        >
        </Input>
      </FormItem> 
     
      <FormItem><DatePicker
        :value="date"
        format="yyyy-MM-dd"
        type="daterange"
        placement="bottom-end"
        placeholder="Select date"
        style="width: 200px"
        @on-change="change"
      ></DatePicker></FormItem>
      <FormItem>
        <Button
          type="primary"
          @click="getData(1,10)"
        >搜索</Button>
        <Button
          type="primary"
          @click="reset('formInline')"
        >重置</Button>
      </FormItem>
    </Form>

    <el-table
      :data="tableData"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
      :row-key="getRowKeys"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
        reserve-selection
      ></el-table-column>
      <el-table-column
        prop="name"
        label="组织名称"
        align="center"
      >

      </el-table-column>
      <el-table-column
        prop="address"
        label="组织地址"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="longitude"
        label="经度"
        align="center"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="latitude"
        label="纬度"
        align="center"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="leadName"
        label="负责人"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="leadPhone"
        label="负责人手机号"
        align="center"
        width="150"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="description"
        label="备注"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
         
          <el-button
            size="mini"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="page-change"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20]"
      :current-page="1"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      v-if="total>10"
    ></el-pagination>
    <el-dialog
      title="编辑"
      :visible.sync="dialogEditVisible"
      @open="open"
      :close-on-click-modal='false'
    >
      <el-form
        :model="formLabelEdit"
        label-position="right"  
        label-width="110px"
        ref="formLabelEdit"
        :rules="rules"
      >
       <el-form-item
          label="组织名称："
          prop="name"
        >
          <el-input
            v-model="formLabelEdit.name"
            placeholder="请输入组织名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="组织地址"
          prop="address"
        >
          <el-input
            v-model="formLabelEdit.address"
            placeholder="组织地址"
          ></el-input>
            <el-tag size="mini">经度：{{formLabelEdit.longitude}}</el-tag>
            <el-tag size="mini">纬度：{{formLabelEdit.latitude}}</el-tag>
        </el-form-item>
        <el-form-item
          label="负责人："
          prop="leadName"
        >
          <el-input
            v-model="formLabelEdit.leadName"
            placeholder="负责人"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="手机号："
          prop="leadPhone"
        >
          <el-input
            v-model="formLabelEdit.leadPhone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="备注："
          prop="remark"
        >
          <el-input
            v-model="formLabelEdit.remark"
            placeholder="备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveEdit('formLabelEdit')"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="新增"
      :visible.sync="dialogAddVisible"
      @open="open"
      :close-on-click-modal='false'
    >
      <el-form
        :model="formLabelAdd"
        label-position="right"
        label-width="110px"
        ref="formLabelAdd"
        :rules="rules"
      >
        <el-form-item
          label="组织名称："
          prop="name"
        >
          <el-input
            v-model="formLabelAdd.name"
            placeholder="请输入组织名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="组织地址"
          prop="address"
        >
          <el-input
            v-model="formLabelAdd.address"
            placeholder="组织地址"
          ></el-input>
            <el-tag size="mini">经度：{{formLabelAdd.longitude}}</el-tag>
            <el-tag size="mini">纬度：{{formLabelAdd.latitude}}</el-tag>
        </el-form-item>
        <el-form-item
          label="负责人："
          prop="leadName"
        >
          <el-input
            v-model="formLabelAdd.leadName"
            placeholder="负责人"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="手机号："
          prop="leadPhone"
        >
          <el-input
            v-model="formLabelAdd.leadPhone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="备注："
          prop="remark"
        >
          <el-input
            v-model="formLabelAdd.remark"
            placeholder="备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleAdd('formLabelAdd')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      progress: 0,
      tableData: [],
      mapList: [],
      meetingList: [],
      saleList: [],
      date: [],
      multipleSelection: [],
      getRowKeys(row) {
        return row.id;
      },
      formLabelEdit: {},
      formLabelAdd: {},
      formInline: {},
      page: 1,
      rows: 10,
      total: 0,
      dialogEditVisible: false,
      dialogAddVisible: false,
      rules: {
        workMode: [
          { required: true, message: "请选择默认模式", trigger: "change" }
        ],
        mapId: [{ required: true, message: "请选择地图", trigger: "change" }],
        roleIds: [{ required: true, message: "请选择角色", trigger: "change" }],
        salesPromotionId: [
          { required: true, message: "请选择促销模板", trigger: "change" }
        ]
      }
    };
  },
  computed: {
    address() {
      return this.formLabelAdd.address;
    },
  },
  watch: {
    address(val) {
      this.getLocation(val);
    },
  },
  mounted() {
    this.getData(1, 10);
  },
  methods: {
     // 高德地图获取经纬度
    getLocation(address) {
      this.$axios
        .get(
          `https://restapi.amap.com/v3/geocode/geo?address=${
            this.address
          }&key=2a22e943ec56f0c4a7c62c9d8f344c37`
        )
        .then(res => {
          console.log(res);
          if (res.data.info == "OK") {
            if (res.data.geocodes[0]) {
              this.$set(
                this.formLabelAdd,
                "latitude",
                res.data.geocodes[0].location.split(",")[1]
              );
              this.$set(
                this.formLabelAdd,
                "longitude",
                res.data.geocodes[0].location.split(",")[0]
              );
              this.errorMsg = "";
            } else {
              this.errorMsg = "请输入有效地址";
              console.log(this.errorMsg);
            }
          }
        });
    },
    change(val) {
      console.log(val);
      this.date = val;
    },
    //  全选
    handleSelectionChange(val) {
        console.log(val)
      this.multipleSelection = val;
    },
    // 获取设备列表
    getData(page, rows) {
      console.log(this.date);
      this.$axios
        .post(
          "/management/sysOrganize/getPage",
          this.$qs.stringify({
            page: page,
            size: rows,
            name: this.formInline.name,
            start: this.date[0],
            end: this.date[1]
          })
        )
        .then(res => {
          if (res.status == 200) {
            console.log(res);
            this.tableData = res.data.data.list;
            this.total = res.data.data.total;
          }
        });
    },
    // 获取角色列表
    getRoleData() {
      this.$axios.post("/management/role/roleData").then(res => {
        if (res.status == 200) {
          console.log(res);
          this.meetingList = res.data.data;
        }
      });
    },
    handleAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(
              "/management/sysOrganize/save",
              this.$qs.stringify(this.formLabelAdd)
            )
            .then(res => {
              if (res.status == 200) {
                if (res.data.code == 1) {
                  this.$Message.warning("手机号重复");
                  return;
                } else if (res.data.code == 200) {
                  console.log(res);
                  this.getData(1, 10);
                  this.dialogAddVisible = false;
                  this.$Message.success("添加成功");
                }
              }
            });
        }
      });
    },
    open() {
      this.formLabelAdd = {};
      this.getRoleData();
    },
    // 打开编辑
    handleEdit(index, row) {
      console.log(row);
      this.getRoleData();
      this.dialogEditVisible = true;
      this.$axios
        .post(
          `/management/sysOrganize/getDetails`,
          this.$qs.stringify({ id: row.id })
        )
        .then(res => {
          console.log(res);
          this.formLabelEdit = res.data.data;
        });
    },
    saveEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(
              "/management/sysOrganize/save",
              this.$qs.stringify({
                id: this.formLabelEdit.id,
                name: this.formLabelEdit.name,
                longitude: this.formLabelEdit.longitude,
                latitude: this.formLabelEdit.latitude,
                leadName: this.formLabelEdit.leadName,
                leadPhone: this.formLabelEdit.leadPhone,
                remark: this.formLabelEdit.remark,
                address: this.formLabelEdit.address,
              })
            )
            .then(res => {
              if (res.status == 200) {
                console.log(res);
                this.$Message.success("修改成功");
                this.formLabelEdit = {};
                this.getData(1,10);
                this.dialogEditVisible = false;
              }
            });
        }
      });
    },
    // 删除
    handleDelete(index, rows) {
      console.log(rows,index);
        let ids = [];
      this.multipleSelection.filter(item => {
        ids.push(item.id);
      });
      ids = ids.join(",");
      console.log(ids);
      if(ids=='' && rows==undefined){
        this.$message.error('请勾选需要批量删除的数据')
        return
      }
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios
          .post(`/management/sysOrganize/delete?ids=${rows?rows.id:ids}`)
          .then(res => {
            if (res.status == 200) {
              this.$message.success("删除成功");
              this.getData(1, 10);
            }
          });
      });
    },
    // 上下线
    handleOnline(index, rows) {
     
      this.$confirm("此操作将修改该用户状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios
          .post(`/management/sysuser/upOrDownUserState`,this.$qs.stringify({
              userId:rows.id,
              state:rows.state==0?1:0
          }))
          .then(res => {
            if (res.status == 200) {
              this.$message.success("切换成功");
              this.getData(1, 10);
            }
          });
      });
    },
    //文件上传
    handleRemove(file, fileList) {
      // this.formLabelEdit.url = "";
      this.fileList = [];
    },
    handlePreview(file) {},
    beforeUpload(file) {
      this.imgData.FileName = file.name;
      this.imgData.imgFile = file;
      console.log(file);
      if (this.formLabelEdit.url == "") {
        return false;
      }
    },
    upload(item) {
      let OSS = require("ali-oss");
      let client = new OSS({
        region: "oss-cn-hangzhou", // 服务器集群地区
        accessKeyId: "LTAIBlmIfZYuFy39", // OSS帐号
        accessKeySecret: "WtLJa4obg3fdExi3DL1v3XhT7LIufv", // OSS 密码
        bucket: "whsxdz" // 阿里云上存储的 Bucket
      });
      console.log(item.onProgress);
      let key = "firmware/" + this.formLabelEdit.url + "/" + item.file.name;
      // 存储路径，并且给图片改成唯一名字
      // return client.put(key, item.file,{
      //   progress: progressEvent => {
      //     console.log(progressEvent)
      //       let percent=(progressEvent.loaded / progressEvent.total * 100) | 0
      //       //调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
      //       uploader.onProgress({percent:percent})
      //     }
      // }).then(res => {
      //   console.log(res);
      //   this.formLabelEdit.logType = 0;
      //   this.formLabelEdit.returnUrl ='https://www.we-electron.com/' +res.name;
      // }); // OSS上传
      var that = this;
      function multipartUpload() {
        const fileName =
          "firmware/" + that.formLabelEdit.url + "/" + item.file.name;
        //定义唯一的文件名，打印出来的uid其实就是时间戳
        //client 是第一步中的 client
        client
          .multipartUpload(fileName, item.file, {
            progress: async function(p) {
              //获取进度条的值
              console.log(p);
              that.progress = parseInt(p * 100);
            }
          })
          .then(res => {
            //下面是如果对返回结果再进行处理，根据项目需要
            console.log(res);
            that.formLabelEdit.logType = 0;
            that.formLabelEdit.returnUrl =
              "https://www.we-electron.com/" + res.name;
          })
          .catch(err => {
            console.log("err:", err);
          });
      }
      multipartUpload();
    },
    reset(name){
        console.log(1)
        this.$refs[name].resetFields();
        this.formInline={}
        this.date=[]
        this.getData(1,10)
    },
    // uploadProcess(event,file,filelist){
    //   console.log(file,1)
    //   this.progress = parseInt(file.percentage.toFixed(0));
    // },
    //分页
    handleSizeChange(val) {
      this.rows = val;
      this.getData(this.page, this.rows);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData(this.page, this.rows);
    }
  }
};
</script>

<style >
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
</style>