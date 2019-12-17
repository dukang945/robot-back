<template>
  <div>
    <el-button
      type="primary"
      @click="dialogAddVisible = true"
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
          v-model="formInline.intention"
          placeholder="意图搜索"
          @keyup.enter.native="getData(1,10)"
        >
        <!-- <Icon type="ios-person-outline" slot="prepend"></Icon> -->
        </Input>

      </FormItem>
      <FormItem>
        <Input
          v-model="formInline.question"
          placeholder="问题搜索"
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
    <el-dialog
      title="新增"
      :visible.sync="dialogAddVisible"
      @opened="open"
      width="80%"
    >
      <el-form
        :model="formLabelAdd"
        label-position="right"
        label-width="110px"
        ref="formLabelAdd"
        :rules="rules"
        class="demo-dynamic"
      >
        <el-form-item
          label="意图"
          prop="intention"
        >
          <el-input
            v-model="formLabelAdd.intention"
            placeholder="请输入意图"
            style="width:35%"
          ></el-input>

        </el-form-item>
        <el-row v-if="formLabelAdd.intention">
          <el-col
            :span='12'
            class="synonymBos"
          >
            <el-form-item
              v-for="(item, index) in formLabelAdd.synonymBos"
              :label="'问题' + index"
              :key="item.id"
              :prop="'synonymBos.' + index + '.question'"
              :rules="{
      required: true, message: '问题不能为空', trigger: 'blur'
    }"
            >
              <el-input
                v-model="item.question"
                style="width:70%;margin-right:10px"
              >

              </el-input>
              <el-button
                @click.prevent="addDomain()"
                v-if="index==0"
                icon="el-icon-plus"
                circle
                size="small"
              ></el-button>
              <el-button
                @click.prevent="removeDomain(item)"
                v-if="index!=0"
                icon="el-icon-minus"
                circle
                size="small"
              ></el-button>
            </el-form-item>
          </el-col>
          <el-col
            :span='12'
            class="synonymBos"
          >
            <el-form-item
              v-for="(item, index) in formLabelAdd.synonymBos2"
              :label="'回答' + index"
              :key="item.id"
              :prop="'synonymBos2.' + index + '.answer'"
              :rules="{
      required: true, message: '回答不能为空', trigger: 'blur'
    }"
            >
              <el-input
                v-model="item.answer"
                style="width:70%;margin-right:10px"
              ></el-input>
              <el-button
                @click.prevent="addDomain2()"
                v-if="index==0"
                icon="el-icon-plus"
                circle
                size="small"
              ></el-button>
              <el-button
                @click.prevent="removeDomain2(item)"
                v-if="index!=0"
                icon="el-icon-minus"
                circle
                size="small"
              ></el-button>
              <el-button
                @click.prevent="editDomain2(item,index)"
                icon="el-icon-edit"
                circle
                size="small"
              ></el-button>

            </el-form-item>
          </el-col>
        </el-row>
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
    <el-dialog
      title="编辑"
      :visible.sync="dialogEditVisible"
      :close-on-click-modal='false'
      width="80%"
    >
      <el-form
        :model="formLabelEdit"
        label-position="right"
        label-width="110px"
        ref="formLabelEdit"
        :rules="rules"
        class="demo-dynamic"
      >
        <el-form-item
          label="意图"
          prop="intention"
        >
          <el-input
            v-model="formLabelEdit.intention"
            placeholder="请输入意图"
            style="width:35%"
          ></el-input>

        </el-form-item>

        <el-row v-if="formLabelEdit.intention">
          <el-col
            :span='12'
            class="synonymBos"
          >

            <el-form-item
              v-for="(item, index) in formLabelEdit.synonymBos"
              :label="'问题' + index"
              :key="item.id"
              :prop="'synonymBos.' + index + '.question'"
              :rules="{
      required: true, message: '问题不能为空', trigger: 'blur'
    }"
            >
              <el-input
                v-model="item.question"
                style="width:70%;margin-right:10px"
              >

              </el-input>
              <el-button
                @click.prevent="addDomain()"
                v-if="index==0"
                icon="el-icon-plus"
                circle
                size="small"
              ></el-button>
              <el-button
                @click.prevent="removeDomain(item)"
                v-if="index!=0"
                icon="el-icon-minus"
                circle
                size="small"
              ></el-button>
            </el-form-item>
          </el-col>
          <el-col
            :span='12'
            class="synonymBos"
          >
            <el-form-item
              v-for="(item, index) in formLabelEdit.synonymBos2"
              :label="'回答' + index"
              :key="item.id"
              :prop="'synonymBos2.' + index + '.answer'"
              :rules="{
      required: true, message: '回答不能为空', trigger: 'blur'
    }"
            >
              <el-input
                v-model="item.answer"
                style="width:70%;margin-right:10px"
              ></el-input>
              <el-button
                @click.prevent="addDomain2()"
                v-if="index==0"
                icon="el-icon-plus"
                circle
                size="small"
              ></el-button>
              <el-button
                @click.prevent="removeDomain2(item)"
                v-if="index!=0"
                icon="el-icon-minus"
                circle
                size="small"
              ></el-button>
              <el-button
                @click.prevent="editDomain2(item,index)"
                icon="el-icon-edit"
                circle
                size="small"
              ></el-button>

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span style="color:#F56C6C;float:right">删除已有的问答为直接删除</span>
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
      title="查看"
      :visible.sync="dialogcheckVisible"
      width="80%"
    >
      <el-form
        :model="formLabelEdit"
        label-position="right"
        label-width="110px"
        ref="formLabelEdit"
        :rules="rules"
        class="demo-dynamic"
      >
        <el-form-item
          label="位置点"
          prop="intention"
        >
          <span>{{formLabelEdit.intention}}</span>
        </el-form-item>

        <el-row v-if="formLabelEdit.intention">
          <el-col
            :span='12'
            class="synonymBos"
          >

            <el-form-item
              v-for="(item, index) in formLabelEdit.synonymBos"
              :label="'同义词' + index"
              :key="item.id"
              :prop="'synonymBos.' + index + '.question'"
              :rules="{
      required: true, message: '同义词不能为空', trigger: 'blur'
    }"
            >
              <span>{{item.question}}</span>
            </el-form-item>
          </el-col>
          <el-col
            :span='12'
            class="synonymBos"
          >
            <el-form-item
              v-for="(item, index) in formLabelEdit.synonymBos2"
              :label="'回答' + index"
              :key="item.id"
              :prop="'synonymBos2.' + index + '.answer'"
              :rules="{
      required: true, message: '回答不能为空', trigger: 'blur'
    }"
            >
              <span>{{item.answer}}</span>

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogcheckVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-drawer
      title="迎宾点讲解内容设置"
      :visible.sync="dialogSet"
      direction="ltr"
      custom-class="demo-drawer"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form
          :model="formSet"
          style="width:80%;margin-left:20px"
        >
          <el-form-item
            label="播报内容："
            prop="reportType"
          >
            <Select v-model="formSet.reportType">
              <Option :value="0">MP3语音播报</Option>
              <Option :value="1">文字语音播报</Option>
            </Select>
          </el-form-item>
          <el-form-item
            label="语音文件"
            prop=" reportDetails"
            v-if='formSet.reportType==0'
          >
            <el-upload
              action
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :data="imgData"
              :before-upload="beforeUpload"
              :http-request="upload"
              :limit="1"
              :file-list="fileList"
              list-type="text"
            >
              <el-button
                size="small"
                type="primary"
              >点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item
            label="播报文案"
            prop="reportDetails"
            v-else-if="formSet.reportType==1"
          >
            <Input
              v-model="formSet.reportDetails"
              placeholder="Enter something..."
              type="textarea"
            />
          </el-form-item>
          <el-form-item
            label="画面："
            prop="framesType"
          >
            <Select v-model="formSet.framesType">
              <Option :value="0">视频</Option>
              <Option :value="1">图片</Option>
            </Select>
          </el-form-item>
          <el-form-item label="呈现内容">
            <el-upload
              :class="{hide:this.fileList1.length!=0}"
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
                v-if="formSet.framesType==1"
                slot="tip"
                class="el-upload__tip"
              >图片要求：推荐尺寸1920x1200,大小2M以内，格式JPG/PNG</div>
              <div
                v-else-if="formSet.framesType==0"
                slot="tip"
                class="el-upload__tip"
              >视频要求：推荐分辨率1920x1200，格式MP4</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="dialogSet = false">取 消</el-button>
          <el-button
            type="primary"
            @click="saveSet"
            :loading="loading"
          >{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="intention"
        label="意图"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="question"
        label="问题"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="answer"
        label="回答"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row,'check')"
          >查看</el-button>
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
  </div>
</template>

<script>
import OSS from "ali-oss";
export default {
  data() {
    return {
      imgData: {},
      tableData: [],
      fileList: [],
      fileList1: [],
      page: 1,
      rows: 10,
      total: 0,
      idx: -1,
      dialogAddVisible: false,
      dialogEditVisible: false,
      dialogcheckVisible: false,
      dialogSet: false,
      loading: false,
      selectTime: [],
      formInline: {},
      formSet: {},
      formLabelEdit: {
        synonymBos: [],
        synonymBos2: []
      },
      formLabelAdd: {
        synonymBos: [
          {
            question: ""
          }
        ],
        synonymBos2: [
          {
            answer: ""
          }
        ]
      },
      rules: {
        workMode: [
          { required: true, message: "请选择默认模式", trigger: "change" }
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
    getData(page, rows) {
      this.$axios
        .post("/management/sysquestionans/getPageListByParam", {
          question: this.formInline.question,
          intention: this.formInline.intention,
          pageSize: rows,
          startPage: page
        })
        .then(res => {
          if (res.status == 200) {
            console.log(res);
            this.tableData = res.data.data.questionAnsVos;
            this.total = res.data.data.total;
          }
        });
    },
    open() {
      this.$refs["formLabelAdd"].resetFields();
      this.formLabelAdd = {
        synonymBos: [
          {
            question: "",
            questionType: 0,
            type: 0
          }
        ],
        synonymBos2: [
          {
            answer: "",
            questionType: 0,
            type: 1
          }
        ]
      };
    },
    addDomain() {
      this.formLabelAdd.synonymBos.push({
        question: "",
        questionType: 0,
        type: 0
      });
      if (this.dialogEditVisible) {
        this.formLabelEdit.synonymBos.push({
          question: "",
          questionType: 0,
          type: 0
        });
      }
    },
    removeDomain(item) {
      console.log(item);
      var index = this.formLabelAdd.synonymBos.indexOf(item);
      var index2 = this.formLabelEdit.synonymBos.indexOf(item);
      if (index !== -1) {
        this.formLabelAdd.synonymBos.splice(index, 1);
      }
      if (item.id && index2 != -1) {
        console.log(1);
        this.$axios
          .post(`/management/sysquestionans/deleteById?questionId=${item.id}`)
          .then(res => {
            if (res.status == 200) {
              this.$message.success("删除成功");
              this.formLabelEdit.synonymBos.splice(index, 1);
            }
          });
      } else if (!item.id && index2 != -1) {
        this.formLabelEdit.synonymBos.splice(index, 1);
      }
    },
    addDomain2() {
      this.formLabelAdd.synonymBos2.push({
        answer: "",
        questionType: 0,
        type: 1
      });
      if (this.dialogEditVisible) {
        this.formLabelEdit.synonymBos2.push({
          question: "",
          questionType: 0,
          type: 0
        });
      }
    },
    editDomain2(item, index) {
      console.log(item, index);
      this.formSet = item;
      if (item.framesDetails) {
        this.fileList1 = [{ name: "播放画面", url: item.framesDetails }];
      } else {
        this.fileList1 = [];
      }
      this.dialogSet = true;
      this.idx = index;
    },
    saveSet() {
      if (this.dialogEditVisible) {
        Object.assign(this.formLabelEdit.synonymBos2[this.idx], this.formSet);
      } else if (this.dialogAddVisible) {
        this.formLabelAdd.synonymBos2[this.idx].reportDetails = this.formLabelAdd.synonymBos2[this.idx].reportDetails.replace(/\s+/g,"")
        console.log(this.formLabelAdd.synonymBos2[this.idx].reportDetails)
        Object.assign(this.formLabelAdd.synonymBos2[this.idx], this.formSet);
      }

      console.log(this.formLabelAdd.synonymBos2);
      this.dialogSet = false;
    },
    removeDomain2(item) {
      var index = this.formLabelAdd.synonymBos2.indexOf(item);
      var index2 = this.formLabelEdit.synonymBos2.indexOf(item);
      if (index !== -1) {
        this.formLabelAdd.synonymBos2.splice(index, 1);
      }
      if (item.id && index2 != -1) {
        this.$axios
          .post(`/management/sysquestionans/deleteById?questionId=${item.id}`)
          .then(res => {
            if (res.status == 200) {
              this.formLabelEdit.synonymBos2.splice(index, 1);
            }
          });
      } else if (!item.id && index2 != -1) {
        this.formLabelEdit.synonymBos2.splice(index, 1);
      }
    },
    handleAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var params = [];
          for (
            let index = 0;
            index < this.formLabelAdd.synonymBos.length;
            index++
          ) {
            const element = this.formLabelAdd.synonymBos[index];
            element.intention = this.formLabelAdd.intention;
            params.push(element);
          }
          for (
            let index = 0;
            index < this.formLabelAdd.synonymBos2.length;
            index++
          ) {
            const element = this.formLabelAdd.synonymBos2[index];
            element.intention = this.formLabelAdd.intention;
            params.push(element);
          }
          console.log(params.toString());
          this.$axios
            .post("/management/sysquestionans/saveOrUpdate", params)
            .then(res => {
              if (res.status == 200) {
                if (res.data.code == 521) {
                  this.$Message.warning("位置点重复！");
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
    handleEdit(index, row, flag) {
      console.log(row);
      this.idx = row.id;
      this.formLabelEdit = {
        synonymBos: [],
        synonymBos2: []
      };
      this.$axios
        .post(`/management/sysquestionans/getByGroup?groupStr=${row.groupStr}`)
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            let editArr = res.data.data.data;
            this.formLabelEdit.intention = res.data.data.intention;
            for (let index = 0; index < editArr.length; index++) {
              const element = editArr[index];
              if (element.question) {
                this.formLabelEdit.synonymBos.push(element);
              } else if (element.answer) {
                this.formLabelEdit.synonymBos2.push(element);
              }
              if (flag) {
                this.dialogcheckVisible = true;
              } else {
                this.dialogEditVisible = true;
              }
            }
          }
        });
    },
    saveEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var params = [];
          for (
            let index = 0;
            index < this.formLabelEdit.synonymBos.length;
            index++
          ) {
            const element = this.formLabelEdit.synonymBos[index];
            element.intention = this.formLabelEdit.intention;
            params.push(element);
          }
          for (
            let index = 0;
            index < this.formLabelEdit.synonymBos2.length;
            index++
          ) {
            const element = this.formLabelEdit.synonymBos2[index];
            element.intention = this.formLabelEdit.intention;
            params.push(element);
          }
          console.log(params.toString());
          this.$axios
            .post(
              `/management/sysquestionans/saveOrUpdate?id=${this.idx}`,
              params
            )
            .then(res => {
              if (res.status == 200) {
                if (res.data.code == 521) {
                  this.$Message.warning("位置点重复！");
                } else if (res.data.code == 200) {
                  console.log(res);
                  this.getData(1, 10);
                  this.dialogEditVisible = false;
                  this.$Message.success("编辑成功");
                }
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
            `/management/sysquestionans/deleteByGroup?groupStr=${rows.groupStr}`
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
    upload(item) {
      let client = new OSS({
        region: "oss-cn-shanghai", // 服务器集群地区
        accessKeyId: "LTAIBlmIfZYuFy39", // OSS帐号
        accessKeySecret: "WtLJa4obg3fdExi3DL1v3XhT7LIufv", // OSS 密码
        bucket: "whsxdz-robot" // 阿里云上存储的 Bucket
      });
      let key =
        new Date().valueOf() +
        "_" +
        Math.round(Math.random() * 999999) +
        "/" +
        item.file.name; // 存储路径，并且给图片改成唯一名字
      return client.put(key, item.file).then(res => {
        this.formLabelAdd.synonymBos[this.idx].reportDetails = res.url;
        console.log(this.formLabelAdd);
        if (this.dialogEditVisible) {
          this.formLabelEdit.synonymBos[this.idx].reportDetails = res.url;
        }
      }); // OSS上传
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
        Math.round(Math.random() * 999999) +
        "/" +
        item.file.name; // 存储路径，并且给图片改成唯一名字
      return client.put(key, item.file).then(res => {
        // this.$set(this.formLabelAdd.synonymBos2[idx],'framesDetails',res.url)
        this.fileList1 = [{url:res.url}]
        this.formLabelAdd.synonymBos2[this.idx].framesDetails = res.url;
        console.log(this.formLabelAdd);
        if (this.dialogEditVisible) {
          this.formLabelEdit.synonymBos2[this.idx].framesDetails = res.url;
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

<style >
.synonymBos {
  max-height: 300px;
  overflow-y: auto;
}
.hide .el-upload--picture-card {
    display: none;
}
</style>