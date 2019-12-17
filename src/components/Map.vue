<template>
  <div>
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
          placeholder="地图搜索"
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
          label="地图名称"
          prop="intention"
        >
          <el-input
            v-model="formLabelEdit.name"
            placeholder="请输入地图名称"
            style="width:35%"
          ></el-input>

        </el-form-item>
        <el-form-item
          label="地图点名称"
          prop="intention"
        >
          <el-tag
              v-for="tag in checkboxGroup"
              :key="tag.position"
              @click="contentSet(tag)"
            >
              {{tag.position}}
            </el-tag>

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
    <el-table
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="name"
        label="地图名称"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
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
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      title="、地图点设置"
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
            label="位置点名称"
            prop="position"
          >
            <Input
              v-model="formSet.position"
              placeholder="Enter something..."
            />
          </el-form-item>
          <el-form-item
            label="意图"
            prop="intention"
          >
            <Input
              v-model="formSet.intention"
              placeholder="Enter something..."
            />
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
export default {
  data() {
    return {
      tableData: [],
      page: 1,
      rows: 10,
      total: 0,
      idx: -1,
      checkboxGroup:[],
      dialogEditVisible: false,
      dialogcheckVisible: false,
      dialogSet: false,
      loading: false,
      formInline: {},
      formSet: {},
      formLabelEdit: {
      },
      formLabelAdd: {
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
        .post(
          "/management/sysMap/getMapPage",
          this.$qs.stringify({
            size: rows,
            page: page,
            name:this.formInline.name
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
    open() {
      this.$refs["formLabelAdd"].resetFields();
      this.formLabelAdd = {};
    },
    handleEdit(index, row) {
      console.log(row);
      this.idx = row.id;
      this.formLabelEdit = {};
      this.$axios
        .post(`/management/sysMap/getDetails?id=${row.id}`)
        .then(res => {
          console.log(res);
          if (res.status == 200) {
              this.checkboxGroup = res.data.data.mapSign
              this.formLabelEdit = res.data.data.map
              this.dialogEditVisible = true
          } 
        });
    },
    saveEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(
              `/management/sysMap/saveMapInfo?id=${this.idx}`,
              this.$qs.stringify({
                 name:this.formLabelEdit.name 
              })
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
    contentSet(tag) {
        console.log(tag)
      this.dialogSet = true;
      this.formSet = tag
    },
    saveSet() {
      this.$confirm("确定要提交表单吗？")
        .then(_ => {
          this.loading = true;
          this.$axios
            .post(
              "/management/sysMap/saveMapSign",
              this.$qs.stringify({
                position: this.formSet.position,
                intention: this.formSet.intention,
                id: this.formSet.id,
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
.synonymBos {
  max-height: 300px;
  overflow-y: auto;
}
.el-tag{
    margin-right: 20px;
}
</style>