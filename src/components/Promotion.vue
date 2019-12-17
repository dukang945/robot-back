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
        prop="bannerNum"
        label="banner数量"
        align="center"
        width="150"
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
    > <el-form
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
          label="模板描述"
          prop="content"
        >
          <Input
            v-model="formLabelEdit.description"
            placeholder="Enter something..."
            type="textarea"
          />
        </el-form-item>
        <el-form-item
          label="播报内容"
          prop="content"
        >
          <Input
            v-model="formLabelEdit.content"
            placeholder="Enter something..."
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="banner图片">
          <el-upload
            class="upload-img"
            action
            :on-preview="handlePreview"
            :on-remove="handleRemove1"
            :data="imgData"
            :before-upload="beforeUpload"
            :http-request="upload1"
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
          label="模板描述"
          prop="content"
        >
          <Input
            v-model="formLabelAdd.description"
            placeholder="Enter something..."
            type="textarea"
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
        <el-form-item label="banner图片">
          <el-upload
            class="upload-img"
            action
            :on-preview="handlePreview"
            :on-remove="handleRemove1"
            :data="imgData"
            :before-upload="beforeUpload"
            :http-request="upload1"
            :file-list="fileList1"
            list-type="picture-card"
          >
            <i class="el-icon-plus"></i>
            
            <div
              v-if="formLabelAdd.imageType==0"
              slot="tip"
              class="el-upload__tip"
            >图片要求：推荐尺寸1920x1200,大小2M以内，格式JPG/PNG</div>
            <div
              v-else-if="formLabelAdd.imageType==1"
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
   //移除数组中的数据

Array.prototype.remove = function (val) {
    console.log(this, '')
    var index = '';
    for (var i = 0; i < this.length; i++) {
        if (this[i].indexOf(val)) {
            index= i;
        }else{
            index = -1
        }
    }
    console.log(index)
    if (index > -1) {
        this.splice(index, 1);
    }
}
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
        .post("/management/salespro/getPageListByParam", {
          startPage: page,
          pageSize: rows
        })
        .then(res => {
          if (res.status == 200) {
            console.log(res);
            this.tableData = res.data.data.salesProPageVos;
            this.total = res.data.data.total;
          }
        });
    },
    handleAdd(formName) {
      this.formLabelAdd.userId = sessionStorage.getItem("id");
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(
              "/management/salespro/saveOrUpdate",
             {
                modelName: this.formLabelAdd.modelName,
                content: this.formLabelAdd.content,
                description: this.formLabelAdd.description,
                salesPromotionBannerEntities: this.formLabelAdd.imageUrl
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
      this.formLabelAdd = {imageUrl:[]};
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
          `/management/salespro/getOneById?salesProPageId=${row.id}`
        )
        .then(res => {
          console.log(res);
          if (res.status == 200) {
              this.formLabelEdit = res.data.data
              if(this.formLabelEdit.salesPromotionBannerEntities){
                this.formLabelEdit.salesPromotionBannerEntities.map(item=>{
                this.fileList1.push({url:item.imageUrl})
              })
              }
              // this.fileList1 = this.formLabelEdit.salesPromotionBannerEntities
          }
        });
    },
    saveEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(
              "/management/salespro/saveOrUpdate",
              {
                id: this.formLabelEdit.id,
                 modelName: this.formLabelEdit.modelName,
                content: this.formLabelEdit.content,
                description: this.formLabelEdit.description,
                salesPromotionBannerEntities: this.formLabelEdit.salesPromotionBannerEntities
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
            `/management/salespro/deleteById?saleModeId=${rows.id}`
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
    handleRemove1(file, fileList) {
        console.log(file,fileList)
        this.formLabelAdd.imageUrl=[]
        this.formLabelEdit.salesPromotionBannerEntities=[]
        fileList.map(item=>{
          if(this.dialogAddVisible){
            this.formLabelAdd.imageUrl.push({imageUrl:item.url})
          }
          if(this.dialogEditVisible){
          this.formLabelEdit.salesPromotionBannerEntities.push({imageUrl:item.url})
          // this.formLabelEdit.salesPromotionBannerEntities = fileList
        }
        })
        // this.formLabelAdd.imageUrl = fileList
        
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
        console.log(item,this.fileList1)
      let client = new OSS({
        region: "oss-cn-shanghai", // 服务器集群地区
        accessKeyId: "LTAIBlmIfZYuFy39", // OSS帐号
        accessKeySecret: "WtLJa4obg3fdExi3DL1v3XhT7LIufv", // OSS 密码
        bucket: "whsxdz-robot" // 阿里云上存储的 Bucket
      });
      let key =
        new Date().valueOf() +
        "_" +
        Math.round(Math.random() * 999999) + '/'+item.file.name
         // 存储路径，并且给图片改成唯一名字
         console.log(1);
      return client.put(key, item.file).then(res => {
          this.fileList1.push(res)
          console.log(this.formLabelAdd.imageUrl); 
          if(this.formLabelAdd.imageUrl){
            this.formLabelAdd.imageUrl.push({imageUrl:res.url})
          }else{
            this.formLabelAdd.imageUrl=[]
            this.formLabelAdd.imageUrl.push({imageUrl:res.url})
          }
        console.log(this.formLabelAdd.imageUrl);
        if (this.dialogEditVisible) {
          if(this.formLabelEdit.salesPromotionBannerEntities){
            this.formLabelEdit.salesPromotionBannerEntities.push({imageUrl:res.url})
          }else{
            this.formLabelEdit.salesPromotionBannerEntities=[]
            this.formLabelEdit.salesPromotionBannerEntities.push({imageUrl:res.url})
          }
          console.log(this.formLabelEdit.salesPromotionBannerEntities);
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