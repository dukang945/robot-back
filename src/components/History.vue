<template>
  <div>
    <Form
      ref="formInline"
      :model="formInline"
      inline
      style="float:right"
      @submit.native.prevent
    >

      <FormItem prop="user">
        <el-date-picker
          v-model="selectTime"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
        >
        </el-date-picker>
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
    >
      <el-table-column
        prop="id"
        label="id"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="title"
        label="固件名称"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="修改时间"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="createBy"
        label="最后操作人"
        align="center"
      >
      </el-table-column>
      <el-table-column label="操作类型" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.logType==0?'上传':'删除'}}</span>
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
      selectTime: [],
      formInline: {}
    };
  },
  mounted() {
    this.getData(1, 10);
  },
  methods: {
    getData(page, rows) {
      this.$axios
        .post(
          "/management/sysLog/selectAll",
          this.$qs.stringify({
            page: page,
            rows: rows,
            startTime: this.selectTime ? this.selectTime[0] : "",
            endTime: this.selectTime ? this.selectTime[1] : ""
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