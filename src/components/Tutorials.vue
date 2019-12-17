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

      <!-- <FormItem>
        <Input
          v-model="formInline.account"
          placeholder="账号搜索"
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
    <el-dialog
      title="预览"
      :visible.sync="dialogVisible"
    >
      <img
        :src="dialogImageUrl"
        alt=""
        style="width:100%"
      ></el-dialog>
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
            <el-form-item label="地图">
              <span>{{ props.row.mapname }}</span>
            </el-form-item>
            <el-form-item label="路线名称">
              <span>{{ props.row.lineName }}</span>
            </el-form-item>
            <el-form-item label="线路描述">
              <span>{{ props.row.lineDesc }}</span>
            </el-form-item>
            <el-form-item
              label="生成路线"
              v-if="props.row.explanType==0"
            >
              <el-tag
                v-for="tag in props.row.signList"
                :key="tag.id"
                type='info'
                size="small"
                class="way-line"
              >
                {{tag.mapname}}
              </el-tag>
            </el-form-item>
            <el-form-item
              label="播报内容"
              v-else-if="props.row.explanType==1"
            >
              <span v-if="props.row.signList[0].reportType==1">{{ props.row.signList[0].reportDetails }}</span>
              <audio
                id="mp3"
                :src="props.row.signList[0].reportDetails"
                autoplay
                preload
                loop="loop"
                v-else
              ></audio>
            </el-form-item>
            <el-form-item
              label="画面"
              v-if="props.row.explanType==1"
            >
              <img
                :src="props.row.signList[0].framesDetails"
                alt=""
                v-if="props.row.signList[0].framesType==1"
                width="200px"
              >
              <!-- <audio :src="props.row.signList[0].framesDetails"></audio> -->
              <embed
                :src="props.row.signList[0].framesDetails"
                width="200"
                v-else
              >
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
        prop="mapname"
        label="地图"
        align="center"
        width="150"
      >
      </el-table-column>
      <el-table-column
        prop="loginAccount"
        label="路线/语音"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{(scope.row.explanType==0?"路线： ":"语音： ")+(scope.row.reportDetails?scope.row.reportDetails:'')}}</span>
          <el-tag
            v-if="scope.row.explanType==0"
            v-for="tag in scope.row.signList"
            :key="tag.id"
            type='info'
            size="small"
            class="way-line"
          >
            {{tag.mapname}}
          </el-tag>
          <span v-else>{{scope.row.signList[0].reportDetails}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="280"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            @click="handleRefresh(scope.$index, scope.row)"
          >推送更新</el-button>
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
          label="地图："
          prop="mapId"
        >
          <Select v-model="formLabelEdit.mapId">
            <Option
              v-for="item in mapList"
              :value="item.id"
              :key="item.id"
            >{{ item.name }}</Option>
          </Select>
        </el-form-item>
        <el-form-item
          label="导览方式："
          prop="explanType"
        >
          <Select v-model="formLabelEdit.explanType">
            <Option :value="0">线路导览</Option>
            <Option :value="1">语音导览</Option>
          </Select>
        </el-form-item>
        <el-form-item
          label="线路名称："
          prop="lineName"
        >
          <Input
            v-model="formLabelEdit.lineName"
            placeholder="Enter something..."
          />
        </el-form-item>
        <el-form-item
          label="线路描述："
          prop="lineDesc"
        >
          <Input
            v-model="formLabelEdit.lineDesc"
            placeholder="Enter something..."
            type="textarea"
          />
        </el-form-item>
        <div v-if="formLabelEdit.explanType==0">

          <el-form-item label="位置点：">
            <el-checkbox-group
              size="small"
              v-model="checkboxGroup"
            >
              <el-checkbox
                v-for="item in positionList"
                :key="item.id"
                :label="item.position"
                v-model="item.id"
                @change=change
                border
              ></el-checkbox>

            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="生成路线：">
            <el-tag
              v-for="tag in checkboxGroup"
              :key="tag.position"
              closable
              class="way-line"
              @close="handleClose(tag)"
              @click="contentSet(tag)"
            >
              {{tag}}
            </el-tag>
          </el-form-item>
        </div>
        <div v-else-if="formLabelEdit.explanType==1">
          <el-form-item
            label="播报内容："
            prop="reportType"
          >
            <Select v-model="formLabelEdit.reportType">
              <Option :value="0">MP3语音播报</Option>
              <Option :value="1">文字语音播报</Option>
            </Select>
          </el-form-item>
          <el-form-item
            label="语音文件"
            prop=" reportDetails"
            v-if='formLabelEdit.reportType==0'
          >
            <el-upload
              class="upload-img"
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
            v-else-if="formLabelEdit.reportType==1"
          >
            <Input
              v-model="formLabelEdit.reportDetails"
              placeholder="Enter something..."
              type="textarea"
            />
          </el-form-item>
          <el-form-item
            label="画面："
            prop="framesType"
          >
            <Select v-model="formLabelEdit.framesType">
              <Option :value="0">视频</Option>
              <Option :value="1">图片</Option>
            </Select>
          </el-form-item>
          <el-form-item label="呈现内容">
            <el-upload
              class="upload-img"
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
                v-if="formLabelEdit.framesType==1"
                slot="tip"
                class="el-upload__tip"
              >图片要求：推荐尺寸1920x1200,大小2M以内，格式JPG/PNG</div>
              <div
                v-else-if="formLabelEdit.framesType==0"
                slot="tip"
                class="el-upload__tip"
              >视频要求：推荐分辨率1920x1200，格式MP4</div>
            </el-upload>
          </el-form-item>
        </div>
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
          label="地图："
          prop="mapId"
        >
          <Select v-model="formLabelAdd.mapId">
            <Option
              v-for="item in mapList"
              :value="item.id"
              :key="item.id"
            >{{ item.name }}</Option>
          </Select>
        </el-form-item>
        <el-form-item
          label="导览方式："
          prop="explanType"
        >
          <Select v-model="formLabelAdd.explanType">
            <Option :value="0">线路导览</Option>
            <Option :value="1">语音导览</Option>
          </Select>
        </el-form-item>
        <el-form-item
          label="线路名称："
          prop="lineName"
        >
          <Input
            v-model="formLabelAdd.lineName"
            placeholder="Enter something..."
          />
        </el-form-item>
        <el-form-item
          label="线路描述："
          prop="lineDesc"
        >
          <Input
            v-model="formLabelAdd.lineDesc"
            placeholder="Enter something..."
            type="textarea"
          />
        </el-form-item>
        <div v-if="formLabelAdd.explanType==0">

          <el-form-item label="位置点：">
            <el-checkbox-group
              size="small"
              v-model="checkboxGroup"
            >
              <el-checkbox
                v-for="item in positionList"
                :key="item.id"
                :label="item.position"
                v-model="item.id"
                @change=change
                border
              ></el-checkbox>

            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="生成路线：">
            <el-tag
              v-for="tag in checkboxGroup"
              :key="tag.position"
              closable
              class="way-line"
              @close="handleClose(tag)"
              @click="contentSet(tag)"
            >
              {{tag}}
            </el-tag>
          </el-form-item>
        </div>
        <div v-else-if="formLabelAdd.explanType==1">
          <el-form-item
            label="播报内容："
            prop="reportType"
          >
            <Select v-model="formLabelAdd.reportType">
              <Option :value="0">MP3语音播报</Option>
              <Option :value="1">文字语音播报</Option>
            </Select>
          </el-form-item>
          <el-form-item
            label="语音文件"
            prop=" reportDetails"
            v-if='formLabelAdd.reportType==0'
          >
            <el-upload
              class="upload-img"
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
            v-else-if="formLabelAdd.reportType==1"
          >
            <Input
              v-model="formLabelAdd.reportDetails"
              placeholder="Enter something..."
              type="textarea"
            />
          </el-form-item>
          <el-form-item
            label="画面："
            prop="framesType"
          >
            <Select v-model="formLabelAdd.framesType">
              <Option :value="0">视频</Option>
              <Option :value="1">图片</Option>
            </Select>
          </el-form-item>
          <el-form-item label="呈现内容">
            <el-upload
              class="upload-img"
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
                v-if="formLabelAdd.framesType==1"
                slot="tip"
                class="el-upload__tip"
              >图片要求：推荐尺寸1920x1200,大小2M以内，格式JPG/PNG</div>
              <div
                v-else-if="formLabelAdd.framesType==0"
                slot="tip"
                class="el-upload__tip"
              >视频要求：推荐分辨率1920x1200，格式MP4</div>
            </el-upload>
          </el-form-item>
        </div>
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
          style="width:80%"
          label-position="right"
          label-width="110px"
        >
          <el-form-item
            label="意图"
            prop="intention"
          >
            <Input
              v-model="formSet.intention"
              placeholder="Enter something..."
            />
          </el-form-item>
          <!-- <el-form-item
            label="疑问点"
            prop="question"
          >
            <Input
              v-model="formSet.question"
              placeholder="Enter something..."
            />
          </el-form-item> -->
          <el-form-item
            label="播报内容："
            prop="reportType"
          >
            <Select v-model="formSet.reportType">
              <Option :value="0">MP3语音播报</Option>
              <Option :value="1">文字语音播报</Option>
            </Select>
          </el-form-item>
          <!-- <el-form-item
            label="语音时长"
            prop="reportTime"
          >
            <Input
              v-model="formSet.reportTime"
              placeholder="Enter something..."
            />
          </el-form-item> -->
          <el-form-item
            label="语音文件"
            prop=" reportDetails"
            v-if='formSet.reportType==0'
          >
            <el-upload
              class="upload-img"
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
              :class="{upload:fileList1.length==1}"
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
          >确定</el-button>
        </div>
      </div>
    </el-drawer>
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
      dialogVisible: false,
      dialogImageUrl: false,
      dialogSet: false,
      rules: {
        mapId: [{ required: true, message: "请选择地图", trigger: "change" }],
        explanType: [
          { required: true, message: "请选择导览方式", trigger: "change" }
        ],
        reportTime: [
          { required: true, message: "请输入播报语音时长", trigger: "blur" }
        ],
        lineName: [
          { required: true, message: "请输入路线名称", trigger: "blur" }
        ],
        lineDesc: [
          { required: true, message: "请输入路线描述", trigger: "blur" }
        ],
        checkboxGroup: [
          { required: true, message: "请选择路线", trigger: "change" }
        ],
        reportType: [
          { required: true, message: "请选择播报内容", trigger: "change" }
        ],
        reportDetails: [
          { required: true, message: "请上传文件或选择文案", trigger: "change" }
        ],
        framesType: [
          { required: true, message: "请选择画面", trigger: "change" }
        ],
        framesDetails: [
          { required: true, message: "请上传文件", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.getData(1, 10);
    this.getMapData();
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
        .post(
          "/management/sysNavigation/getPage",
          this.$qs.stringify({
            startPage: page,
            pageSize: rows
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
    // 获取地图数据
    getMapData(id) {
      this.$axios
        .post(
          "/management/sysNavigation/getMap",
          this.$qs.stringify({
            navigationId: id,
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
        var checkboxGroupId = [];
        this.checkboxGroup.filter(v => {
          this.positionList.forEach(item => {
            console.log(v, item.position);
            if (item.position == v) {
              checkboxGroupId.push(item.id);
            }
          });
        });
        if (valid) {
          this.$axios
            .post(
              "/management/sysNavigation/saveNavigationRoute",
              this.$qs.stringify({
                mapId: this.formLabelAdd.mapId,
                explanType: this.formLabelAdd.explanType,
                lineName: this.formLabelAdd.lineName,
                lineDesc: this.formLabelAdd.lineDesc,
                specificLine: checkboxGroupId.join(","),
                reportType: this.formLabelAdd.reportType,
                reportDetails: this.formLabelAdd.reportDetails,
                framesType: this.formLabelAdd.framesType,
                framesDetails: this.formLabelAdd.framesDetails
              })
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
      this.progress = 0;
      this.fileList = this.fileList1 = [];
      this.checkboxGroup = [];
      this.getMapData();
    },
    // 打开编辑
    handleEdit(index, row) {
      this.formLabelEdit = {};
      this.positionList = [];
      this.checkboxGroup = [];
      this.fileList = this.fileList1 = [];
      console.log(row);
      this.idx = row.id;
      this.getMapData(row.id);
      this.dialogEditVisible = true;
      this.$axios
        .post(
          `/management/sysNavigation/getNavigationDetail?navigationId=${row.id}`
        )
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            this.formLabelEdit = res.data.data.navigation;
            if (this.formLabelEdit.explanType == 1) {
              this.formLabelEdit.reportType =
                res.data.data.signList[0].reportType;
              this.formLabelEdit.reportDetails =
                res.data.data.signList[0].reportDetails;
              this.formLabelEdit.framesType =
                res.data.data.signList[0].framesType;
              this.formLabelEdit.framesDetails =
                res.data.data.signList[0].framesDetails;
              if(this.formLabelEdit.framesDetails){
                this.fileList1 = [
                { name: "画面文件", url: this.formLabelEdit.framesDetails }
              ];
              }else{
                
                this.fileList1=[]
              }
              if (this.formLabelEdit.reportType == 0) {
                this.fileList = [
                  { name: "语音文件", url: this.formLabelEdit.reportDetails }
                ];
              }
            }
            this.positionList = res.data.data.signList;
            var checkboxGroupId = row.specificLine.split(",");
            checkboxGroupId.filter(v => {
              this.positionList.forEach(item => {
                console.log(v, item.mapname);
                if (item.mapSignId == v) {
                  this.checkboxGroup.push(item.mapname);
                }
              });
            });
          }
        });
    },
    saveEdit(formName) {
      this.$refs[formName].validate(valid => {
        var checkboxGroupId = [];
        this.checkboxGroup.filter(v => {
          this.positionList.forEach(item => {
            console.log(v, item.position);
            if (item.position == v) {
              checkboxGroupId.push(item.id);
            }
          });
        });
        if (valid) {
          this.$axios
            .post(
              "/management/sysNavigation/saveNavigationRoute",
              this.$qs.stringify({
                id: this.formLabelEdit.id,
                mapId: this.formLabelEdit.mapId,
                explanType: this.formLabelEdit.explanType,
                lineName: this.formLabelEdit.lineName,
                lineDesc: this.formLabelEdit.lineDesc,
                specificLine: checkboxGroupId.join(","),
                reportType: this.formLabelEdit.reportType,
                reportDetails: this.formLabelEdit.reportDetails,
                framesType: this.formLabelEdit.framesType,
                framesDetails: this.formLabelEdit.framesDetails
              })
            )
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
    handleRefresh(index, row) {
      this.$axios
        .post(`/management/sysNavigation/pushUpdataMessage?id=${row.id}`)
        .then(res => {
          if (res.status == 200) {
            this.$message.success("已更新！");
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
            `/management/sysNavigation/deleteNavigation?navigationId=${rows.id}`
          )
          .then(res => {
            if (res.status == 200) {
              this.$message.success("删除成功");
              this.getData(1, 10);
            }
          });
      });
    },
    contentSet(tag) {
      this.formSet = {};
      this.fileList1 = this.fileList = [];
      this.tagObj = this.positionList.filter(item => {
        console.log(item);
        return item.position == tag;
      });
      console.log(this.tagObj);
      this.dialogSet = true;
      this.$axios
        .post(
          "/management/sysNavigation/getNavigationSignDetailByMapSignId",
          this.$qs.stringify({
            mapSignId: this.tagObj[0].id
          })
        )
        .then(res => {
          if (res.status == 200) {
            if (res.data.code != 1) {
              this.formSet = res.data.data;
              if(this.formSet.framesDetails){
                this.fileList1 = [
                { name: "画面文件", url: this.formSet.framesDetails }
              ];
              }
              if (this.formSet.reportType == 0) {
                this.fileList = [
                  { name: "语音文件", url: this.formSet.reportDetails }
                ];
              }
            }
          }
        });
    },
    saveSet() {
      this.$confirm("确定要提交表单吗？")
        .then(_ => {
          this.loading = true;
          this.$axios
            .post(
              "/management/sysNavigation/saveNavigationSign",
              this.$qs.stringify({
                mapId: this.tagObj[0].mapId,
                navigationId: this.idx,
                mapSignId: this.tagObj[0].id,
                reportType: this.formSet.reportType,
                reportDetails: this.formSet.reportDetails,
                framesType: this.formSet.framesType,
                framesDetails: this.formSet.framesDetails,
                intention: this.formSet.intention,
                reportTime: this.formSet.reportTime
              })
            )
            .then(res => {
              if (res.status == 200) {
                this.loading = false;
                this.$message.success("设置成功");
                this.dialogSet = false;
              }
            });
        })
        .catch(_ => {});
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
        this.fileList1=[]
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
        console.log(res);
        this.formLabelAdd.reportDetails = res.url;
        if (this.dialogEditVisible && !this.dialogSet) {
          this.formLabelEdit.reportDetails = res.url;
        }
        if (this.dialogSet) {
          this.formSet.reportDetails = res.url;
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
        console.log(res);
        this.fileList1 = [{url:res.url}]
        this.formLabelAdd.framesDetails = res.url;
        if (this.dialogEditVisible && !this.dialogSet) {
          console.log(1);
          this.formLabelEdit.framesDetails = res.url;
        } else if (this.dialogSet) {
          this.formSet.framesDetails = res.url;
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
.demo-drawer__footer{
  text-align: center;
}
 /deep/ .el-drawer{
  overflow: auto !important;
}
</style>