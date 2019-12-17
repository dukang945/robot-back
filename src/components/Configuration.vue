<template>
  <div>
    <!-- <el-button
      type="primary"
      @click="dialogAddVisible = true"
      style="margin-bottom:20px"
      size="small"
    >新增</el-button> -->
    <Form
      ref="formInline"
      :model="formInline"
      inline
      style="float:right"
      @submit.native.prevent
    >

      <!-- <FormItem>
        <Input
          v-model="formInline.title"
          placeholder="项目名称"
          @keyup.enter.native="getData(1,10)"
        >
        </Input>
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          @click="getData(1,10)"
        >搜索</Button>
      </FormItem> -->
    </Form>

    <el-table
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form
            label-position="left"
            inline
            class="demo-table-expand"
          >
            <el-form-item label="设备名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="固件版本">
              <span>{{ props.row.firmwareVersion }}</span>
            </el-form-item>
            <el-form-item label="系统版本">
              <span>{{ props.row.systemVersion }}</span>
            </el-form-item>
            <el-form-item label="MAC地址">
              <span>{{ props.row.macAddress }}</span>
            </el-form-item>
            <el-form-item label="地图">
              <span>{{ props.row.mapName }}</span>
            </el-form-item>
            <el-form-item label="默认模式">
              <span>{{ props.row.workMode }}</span>
            </el-form-item>
            <el-form-item label="迎宾模板">
              <span>{{ props.row.usherModeName }}</span>
            </el-form-item>
            <el-form-item label="热销纪念品模板">
              <span>{{ props.row.salesPromotionName }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="id"
        width="50"
        align="center"
      >

      </el-table-column>
      <el-table-column
        prop="name"
        label="设备名称"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="mapName"
        label="地图名称"
        width="150"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="workMode"
        label="模式"
        width="150"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="热销纪念品模板"
        prop="salesPromotionName"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="迎宾模板"
        prop="usherModeName"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="180"
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
      :close-on-click-modal='false'
    >
      <el-form
        :model="formLabelEdit"
        label-position="right"
        label-width="140px"
        ref="formLabelEdit"
        :rules="rules"
      >
        <el-form-item
          label=" 设备名称"
          prop="name"
        >
          <el-input
            v-model="formLabelEdit.name"
            placeholder="请输入设备名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="设备编码"
          prop="deviceCode"
        >
          <el-input
            v-model="formLabelEdit.deviceCode"
            placeholder="请输入设备编码"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="地图：">
          <Select v-model="formLabelEdit.mapId">
            <Option
              v-for="item in mapList"
              :value="item.id"
              :key="item.id"
            >{{ item.name }}</Option>
          </Select>
        </el-form-item>
        <el-form-item label="默认模式：">
          <Select v-model="formLabelEdit.workModeType">
            <Option :value="1">讲解模式</Option>
            <Option :value="2">迎宾模式</Option>
            <Option :value="3">自由模式</Option>
          </Select>
        </el-form-item>
        <el-form-item label="迎宾模板：">
          <Select v-model="formLabelEdit.usherModeId">
            <Option
              v-for="item in meetingList"
              :value="item.id"
              :key="item.id"
            >{{ item.modelName }}</Option>
          </Select>
        </el-form-item>
        <el-form-item label="热销纪念品模板：">
          <Select v-model="formLabelEdit.salesPromotionId">
            <Option
              v-for="item in saleList"
              :value="item.id"
              :key="item.id"
            >{{ item.modelName }}</Option>
          </Select>
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
        label-width="140px"
        ref="formLabelAdd"
        :rules="rules"
      >
        <el-form-item
          label=" 设备名称"
          prop="name"
        >
          <el-input
            v-model="formLabelAdd.name"
            placeholder="请输入设备名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="设备编码"
          prop="deviceCode"
        >
          <el-input
            v-model="formLabelAdd.deviceCode"
            placeholder="请输入设备编码"
          ></el-input>
        </el-form-item>
        <el-form-item label="地图：">
          <Select v-model="formLabelAdd.mapId">
            <Option
              v-for="item in mapList"
              :value="item.id"
              :key="item.id"
            >{{ item.name }}</Option>
          </Select>
        </el-form-item>
        <el-form-item label="默认模式：">
          <Select v-model="formLabelAdd.workModeType">
            <Option :value="1">讲解模式</Option>
            <Option :value="2">迎宾模式</Option>
            <Option :value="3">自由模式</Option>
          </Select>
        </el-form-item>
        <el-form-item label="迎宾模板：">
          <Select v-model="formLabelAdd.usherId">
            <Option
              v-for="item in meetingList"
              :value="item.id"
              :key="item.id"
            >{{ item.modelName }}</Option>
          </Select>
        </el-form-item>
        <el-form-item label="热销纪念品模板：">
          <Select v-model="formLabelAdd.salesPromotionId">
            <Option
              v-for="item in saleList"
              :value="item.id"
              :key="item.id"
            >{{ item.modelName }}</Option>
          </Select>
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
      formLabelEdit: {},
      formLabelAdd: {},
      formInline: {},
      page: 1,
      rows: 10,
      total: 0,
      dialogEditVisible: false,
      dialogAddVisible: false,
      rules: {
        workModeType: [
          { required: true, message: "请选择默认模式", trigger: "change" }
        ],
        name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        deviceCode: [
          { required: true, message: "请输入设备编码", trigger: "blur" }
        ],
        mapId: [{ required: true, message: "请选择地图", trigger: "change" }],
        usherModeId: [
          { required: true, message: "请选择迎宾模板", trigger: "change" }
        ],
        salesPromotionId: [
          { required: true, message: "请选择促销模板", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.getData(1, 10);
  },
  methods: {
    // 获取设备列表
    getData(page, rows) {
      this.$axios
        .post("/management/sysdevice/getListByPage", {
          startPage: page,
          pageSize: rows
        })
        .then(res => {
          if (res.status == 200) {
            console.log(res);
            this.tableData = res.data.data.deviceInfoVos;
            this.total = res.data.data.total;
          }
        });
    },
    // 下拉框数据
    // 获取地图数据
    getMapData(id) {
      this.$axios
        .post(
          "/management/sysdevice/getMapToBound",
          this.$qs.stringify({
            id: id,
            startPage: 1,
            pageSize: 50
          })
        )
        .then(res => {
          if (res.status == 200) {
            console.log(res);
            this.mapList = res.data.data;
          }
        });
    },
    // 获取迎宾模板
    getMeetingData() {
      this.$axios
        .post("/management/sysusher/getListByPage", {
          pageSize: 50,
          startPage: 1
        })
        .then(res => {
          if (res.status == 200) {
            console.log(res);
            this.meetingList = res.data.data.usherModeVos;
          }
        });
    },
    // 获取促销模板
    getSaleData() {
      this.$axios
        .post("/management/salespro/getPageListByParam", {
          pageSize: 50,
          startPage: 1
        })
        .then(res => {
          if (res.status == 200) {
            console.log(res);
            this.saleList = res.data.data.salesProPageVos;
          }
        });
    },
    handleAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(
              "/management/sysdevice/createDevice",
              this.$qs.stringify(this.formLabelAdd)
            )
            .then(res => {
              if (res.status == 200) {
                if(res.data.code==200){
                  console.log(res);
                this.getData(1, 10);
                this.dialogAddVisible = false;
                this.$Message.success("添加成功");
                }else{
                  this.$message.warning(res.data.msg);
                }
              }
            });
        }
      });
    },
    open() {
      this.formLabelAdd = {};
      this.getMeetingData();
      this.getSaleData();
      this.getMapData();
    },
    // 打开编辑
    handleEdit(index, row) {
      console.log(row);
      this.getMeetingData();
      this.getSaleData();
      this.getMapData(row.id);
      this.dialogEditVisible = true;
      this.$axios
        .get(`/management/sysdevice/getOneById?deviceId=${row.id}`)
        .then(res => {
          console.log(res);
          this.formLabelEdit = res.data.data;
        });
      this.fileList = [];
      this.formLabelEdit = row;
    },
    saveEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/management/sysdevice/updateById", {
              deviceCode: this.formLabelEdit.deviceCode,
              name: this.formLabelEdit.name,
              id: this.formLabelEdit.id,
              mapId: this.formLabelEdit.mapId,
              workType: this.formLabelEdit.workModeType,
              usherId: this.formLabelEdit.usherModeId,
              salesPromotionId: this.formLabelEdit.salesPromotionId
            })
            .then(res => {
              if (res.status == 200) {
                console.log(res);
                this.$Message.success("修改成功");
                this.formLabelEdit = {};
                this.getData(1, 10);
                this.dialogEditVisible = false;
              }
            });
        }
      });
    },
    // 删除
    handleDelete(index, rows) {
      console.log(rows);
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios
          .post(`/management/sysdevice/deleteById?id=${rows.id}`)
          .then(res => {
            if (res.status == 200) {
              this.$message.success("删除成功");
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