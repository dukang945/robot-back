<template>
  <div>
    <el-button
      type="primary"
      @click="dialogAddVisible = true"
      style="margin-bottom:20px"
      size="small"
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
          v-model="formInline.modelName"
          placeholder="模板名称搜索"
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
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline  class="demo-table-expand">
          <el-form-item label="模板名称">
            <span>{{ props.row.modelName }}</span>
          </el-form-item>
          <el-form-item label="播报内容">
            <span>{{ props.row.content }}</span>
          </el-form-item>
          <el-form-item label="画面">
            <!-- <img :src="props.row.imageUrl" alt="" v-if="props.row.imageType==0"> -->
            <embed :src="props.row.imageUrl" width="300">
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
        prop="modelName"
        label="模板名称"
        align="center"
        width="150"
      >
      </el-table-column>
      <el-table-column
        prop="content"
        label="播报内容"
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
        label-width="110px"
        ref="formLabelEdit"
        :rules="rules"
      >
        <el-form-item
          label="模板名称"
          prop="modelName"
        >
          <Input
            v-model="formLabelEdit.modelName"
            placeholder="Enter something..."
          />
        </el-form-item>
        <el-form-item
          label="播报内容"
          prop="reportDetails"
        >
          <Input
            v-model="formLabelEdit.content"
            placeholder="Enter something..."
            type="textarea"
          />
        </el-form-item>
        <el-form-item
          label="画面："
          prop="framesType"
        >
          <Select v-model="formLabelEdit.imageType">
            <Option :value="0">视频</Option>
            <Option :value="1">图片</Option>
          </Select>
        </el-form-item>
        <el-form-item label="呈现内容">
          <el-upload
            :class="{hide:fileList1.length!=0}"
            action
            :on-preview="handlePreview"
            :on-remove="handleRemove1"
            :data="imgData"
            :before-upload="beforeUpload"
            :http-request="upload1"
            :limit="1"
            :file-list="fileList1"
            list-type="picture-card"
          >
            <i class="el-icon-plus"></i>
            <div
              v-if="formLabelEdit.imageType==1"
              slot="tip"
              class="el-upload__tip"
            >图片要求：推荐尺寸1920x1200,大小2M以内，格式JPG/PNG</div>
            <div
              v-else-if="formLabelEdit.imageType==0"
              slot="tip"
              class="el-upload__tip"
            >视频要求：推荐分辨率1920x1200，格式MP4</div>
          </el-upload>
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
          label="模板名称"
          prop="modelName"
        >
          <Input
            v-model="formLabelAdd.modelName"
            placeholder="Enter something..."
          />
        </el-form-item>
        <el-form-item
          label="播报内容"
          prop="content"
        >
          <Input
            v-model="formLabelAdd.content"
            placeholder="Enter something..."
            type="textarea"
          />
        </el-form-item>
        <el-form-item
          label="画面："
          prop="imageType"
        >
          <Select v-model="formLabelAdd.imageType">
            <Option :value="0">视频</Option>
            <Option :value="1">图片</Option>
          </Select>
        </el-form-item>
        <el-form-item label="呈现内容">
          <el-upload
            :class="{hide:fileList1.length!=0}"
            action
            :on-preview="handlePreview"
            :on-remove="handleRemove1"
            :data="imgData"
            :before-upload="beforeUpload"
            :http-request="upload1"
            :limit="1"
            :file-list="fileList1"
            list-type="picture-card"
          >
            <i class="el-icon-plus"></i>
            <div
              v-if="formLabelAdd.imageType==1"
              slot="tip"
              class="el-upload__tip"
            >图片要求：推荐尺寸1920x1200,大小2M以内，格式JPG/PNG</div>
            <div
              v-else-if="formLabelAdd.imageType==0"
              slot="tip"
              class="el-upload__tip"
            >视频要求：推荐分辨率1920x1200，格式MP4</div>
          </el-upload>
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
import OSS from "ali-oss";
export default {
  data() {
    return {
      progress: 0,
      loading: false,
      idx: -1,
      tableData: [],
      imgData: {},
      fileList: [],
      fileList1: [],
      mapList: [],
      positionList: [],
      tagObj: [],
      tags: [],
      checkboxGroup: [],
      checkboxGroupId: [],
      formLabelEdit: {},
      formLabelAdd: {},
      formSet: {},
      formInline: {},
      page: 1,
      rows: 10,
      total: 0,
      dialogEditVisible: false,
      dialogAddVisible: false,
      dialogSet: false,
      rules: {
        modelName: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
        content: [
          { required: true, message: "请输入播报内容", trigger: "blur" }
        ],
        imageType: [
          { required: true, message: "请选择类型", trigger: "change" }
        ],
        lineDesc: [
          { required: true, message: "请输入路线描述", trigger: "blur" }
        ]
        
      }
    };
  },
  mounted() {
    this.getData(1, 10);
  },
  computed: {
    mapId() {
      return this.formLabelAdd.mapId;
    },
    _mapId() {
      return this.formLabelEdit.mapId;
    }
  },
  watch: {
    mapId(val) {
      if (val != undefined) {
        this.getSignData(val);
      }
    },
    _mapId(val) {
      if (val != undefined) {
        this.getSignData(val);
      }
    }
  },
  methods: {
    //删除路线
    handleClose(tag) {
      this.checkboxGroup.splice(this.checkboxGroup.indexOf(tag), 1);
    },
    change() {
      console.log(this.checkboxGroup);
    },
    // 获取列表
    getData(page, rows) {
      this.$axios
        .post("/management/sysusher/getListByPage", {
          startPage: page,
          pageSize: rows,
          modelName:this.formInline.modelName
        })
        .then(res => {
          if (res.status == 200) {
            console.log(res);
            this.tableData = res.data.data.usherModeVos;
            this.total = res.data.data.total;
          }
        });
    },
    // 获取讲解点
    getSignData(id) {
      this.$axios
        .post(`/management/sysNavigation/getMapSign?mapId=${id}`)
        .then(res => {
          if (res.status == 200) {
            console.log(res);
            this.positionList = res.data.data;
          }
        });
    },
    handleAdd(formName) {
      this.formLabelAdd.userId = sessionStorage.getItem("id");
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(
              "/management/sysusher/saveOrUpdate",
             {
                modelName: this.formLabelAdd.modelName,
                content: this.formLabelAdd.content,
                imageType: this.formLabelAdd.imageType,
                imageUrl: this.formLabelAdd.imageUrl
              }
            )
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
      this.fileList = this.fileList1 = [];
    },
    // 打开编辑
    handleEdit(index, row) {
      this.formLabelEdit = {};
      this.fileList = this.fileList1 = [];
      console.log(row);
      this.idx = row.id;
      this.dialogEditVisible = true;
      this.$axios
        .get(
          `/management/sysusher/getOneById?usherId=${row.id}`
        )
        .then(res => {
          console.log(res);
          if (res.status == 200) {
              this.formLabelEdit = res.data.data
              this.fileList1 = this.formLabelEdit.imageUrl?[{name:'画面',url:this.formLabelEdit.imageUrl}]:[]
          }
        });
    },
    saveEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(
              "/management/sysusher/saveOrUpdate",
              {
                id: this.formLabelEdit.id,
                 modelName: this.formLabelEdit.modelName,
                content: this.formLabelEdit.content,
                imageType: this.formLabelEdit.imageType,
                imageUrl: this.formLabelEdit.imageUrl
              }
            )
            .then(res => {
              if (res.status == 200) {
                console.log(res);
                this.$Message.success("修改成功");
                this.formLabelEdit = {};
                this.getData()
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
          .post(
            `/management/sysusher/deleteById?usherModeId=${rows.id}`
          )
          .then(res => {
            if (res.status == 200) {
              this.$message.success("删除成功");
              this.getData(1, 10);
            }
          });
      });
    },
    //图片上传
    handleRemove(file, fileList) {
      this.formLabelAdd.reportDetails = "";
      if (this.dialogEditVisible) {
        this.formLabelEdit.reportDetails = "";
      } else if (this.dialogEditVisible && !this.dialogSet) {
        this.formSet.reportDetails = "";
      }
    },
    handleRemove1(file, fileList) {
      this.formLabelAdd.framesDetails = "";
      this.fileList1=[]
      if (this.dialogEditVisible && !this.dialogSet) {
        this.formLabelEdit.framesDetails = "";
      } else if (this.dialogSet) {
        this.formSet.framesDetails = "";
      }
    },
    handlePreview(file) {
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
    },
    beforeUpload(file) {
      this.imgData.FileName = file.name;
      this.imgData.imgFile = file;
      console.log(file);
    },
    upload1(item) {
      let client = new OSS({
        region: "oss-cn-shanghai", // 服务器集群地区
        accessKeyId: "LTAIBlmIfZYuFy39", // OSS帐号
        accessKeySecret: "WtLJa4obg3fdExi3DL1v3XhT7LIufv", // OSS 密码
        bucket: "whsxdz-robot" // 阿里云上存储的 Bucket
      });
      let key =
        new Date().valueOf() +
        "_" +
        Math.round(Math.random() * 999999) + '/'+item.file.name // 存储路径，并且给图片改成唯一名字
      return client.put(key, item.file).then(res => {
        console.log(res);
        this.fileList1=[{url:res.url}]
        this.formLabelAdd.imageUrl = res.url;
        if (this.dialogEditVisible) {
          console.log(1);
          this.formLabelEdit.imageUrl = res.url;
        }
      }); // OSS上传
    },
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
.way-line {
  margin-right: 40px;
  position: relative;
}
.way-line::before {
  content: "→";
  font-size: 20px;
  position: absolute;
  right: -30px;
  color: dimgrey;
}
.way-line:last-of-type::before {
  content: "";
  font-size: 0;
  cursor: pointer;
}
</style>