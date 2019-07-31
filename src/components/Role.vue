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
          v-model="formInline.account"
          placeholder="账号搜索"
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
        prop="realName"
        label="用户名称"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="loginAccount"
        label="账号名称"
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
          label="用户名"
          prop="realName"
        >
          <el-input
            v-model="formLabelEdit.realName"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="pwd"
        >
          <el-input
            v-model="formLabelEdit.pwd"
            placeholder="请输入新密码"
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
    >
      <el-form
        :model="formLabelAdd"
        label-position="right"
        label-width="110px"
        ref="formLabelAdd"
        :rules="rules"
      >
        <el-form-item
          label="用户名"
          prop="realName"
        >
          <el-input
            v-model="formLabelAdd.realName"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="账号"
          prop="account"
        >
          <el-input
            v-model="formLabelAdd.account"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="pwd"
        >
          <el-input
            v-model="formLabelAdd.pwd"
            placeholder="请输入密码"
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
        pwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        realName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
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
          "/management/sysAccount/selectAll",
          this.$qs.stringify({
            page: page,
            rows: rows,
            account: this.formInline.account?this.formInline.account:""
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
            .post("/management/sysAccount/add", this.$qs.stringify({
                realName:this.formLabelAdd.realName,
                account:this.formLabelAdd.account,
                pwd:this.formLabelAdd.pwd,
                userId: sessionStorage.getItem("id"),
            }))
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
      this.formLabelEdit = row;
    },
    saveEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(
              "/management/sysAccount/edit",
              this.$qs.stringify({
                id: this.formLabelEdit.id,
                userId: sessionStorage.getItem("id"),
                pwd: this.formLabelEdit.pwd,
                realName: this.formLabelEdit.realName
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
        this.$axios.get(`/management/sysAccount/del?id=${rows.id}`).then(res => {
          if (res.status == 200) {
            this.$message.success("删除成功");
            this.getData(1, 10);
          }
        });
      });
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
</style>