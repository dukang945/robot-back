<template>
  <div>
    <el-button
      type="primary"
      @click="dialogAddVisible = true"
    >新增</el-button>
    <Form
      ref="formInline"
      :model="formInline"
      inline
      style="float:right"
      @submit.native.prevent
    >

      <FormItem>
        <Input
          v-model="formInline.title"
          placeholder="项目名称"
          @keyup.enter.native="getData(1,10)"
        >
        <!-- <Icon type="ios-person-outline" slot="prepend"></Icon> -->
        </Input>
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          @click="getData(1,10)"
        >搜索</Button>
      </FormItem>
    </Form>

    <el-table
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="id"
        label="id"
        width="50"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="title"
        label="项目名称"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="250"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="url"
        label="上传目录"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="文件路径"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.returnUrl !=null">{{scope.row.returnUrl}}</span>
        </template>
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
          label="项目名称"
          prop="title"
        >
          <el-input
            v-model="formLabelEdit.title"
            placeholder="请输入项目名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="储存位置"
          prop="url"
        >
          <el-input
            v-model="formLabelEdit.url"
            placeholder="请输入储存位置"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="项目路径"
          prop="returnUrl"
        >
          <el-input
            v-model="formLabelEdit.returnUrl"
            placeholder="文件所在目录"
            readonly="readonly"
          ></el-input>
        </el-form-item>
        <el-form-item label="文件上传">
          <el-upload
            class="upload-img"
            action
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :data="imgData"
            :before-upload="beforeUpload"
            :http-request="upload"
            :file-list="fileList"
          >

            <el-button
              size="small"
              type="primary"
            >点击上传</el-button>
          </el-upload>
          <el-progress :percentage="progress" status="success" v-if="progress==100"></el-progress>
          <el-progress :percentage="progress"  v-else-if="progress!=100&&progress!=0"></el-progress>
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
    >
      <el-form
        :model="formLabelAdd"
        label-position="right"
        label-width="110px"
        ref="formLabelAdd"
        :rules="rules"
      >
        <el-form-item
          label="项目名称"
          prop="title"
        >
          <el-input
            v-model="formLabelAdd.title"
            placeholder="请输入项目名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="存储位置"
          prop="url"
        >
          <el-input
            v-model="formLabelAdd.url"
            placeholder="请输入文件夹名称"
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
      imgData: {},
      fileList: [],
      formLabelEdit: {},
      formLabelAdd: {},
      formInline: {},
      page: 1,
      rows: 10,
      total: 0,
      dialogEditVisible: false,
      dialogAddVisible: false,
      rules: {
        title: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
        url: [{ required: true, message: "请输入储存位置", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.getData(1, 10);
  },
  methods: {
    // 获取固件列表
    getData(page, rows) {
      this.$axios
        .post(
          "/management/tPro/selectAll",
          this.$qs.stringify({
            page: page,
            rows: rows,
            title: this.formInline.title
          })
        )
        .then(res => {
          if (res.status == 200) {
            console.log(res);
            this.tableData = res.data.data.rows;
            this.total = res.data.data.total;
          }
        });
    },
    handleAdd(formName) {
      this.formLabelAdd.userId = sessionStorage.getItem("id");
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/management/tPro/add", this.$qs.stringify(this.formLabelAdd))
            .then(res => {
              if (res.status == 200) {
                console.log(res);
                this.getData(1, 10);
                this.dialogAddVisible = false;
                this.$Message.success("添加成功");
              }
            });
        }
      });
    },
    open() {
      this.formLabelAdd = {};
      this.progress = 0
    },
    // 打开编辑
    handleEdit(index, row) {
      console.log(row);
      this.dialogEditVisible = true;
      this.fileList = [];
      this.formLabelEdit = row;
    },
    saveEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(
              "/management/tPro/edit",
              this.$qs.stringify({
                id: this.formLabelEdit.id,
                userId: sessionStorage.getItem("id"),
                title: this.formLabelEdit.title,
                url: this.formLabelEdit.url,
                returnUrl: this.formLabelEdit.returnUrl,
                logType: this.formLabelEdit.logType
              })
            )
            .then(res => {
              if (res.status == 200) {
                console.log(res);
                this.$Message.success("修改成功");
                this.formLabelEdit = {};
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
        this.$axios.get(`/management/tPro/del?id=${rows.id}`).then(res => {
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
       client.multipartUpload(fileName, item.file, {
            progress:async function(p) {
              //获取进度条的值
              console.log(p);
              that.progress = parseInt(p * 100);
            }
          })
          .then(res => {
            //下面是如果对返回结果再进行处理，根据项目需要
            console.log(res)
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

<style scoped>
</style>