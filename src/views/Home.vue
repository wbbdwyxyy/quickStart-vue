<template>
  <div>
    <div style="display: flex; justify-content: space-between">
      <div>
        <el-input style="width: 200px;margin-right: 10px" prefix-icon="el-icon-search"
                  v-model="queryParam.username" placeholder="请输入用户名"
                  clearable
                  @clear="initUsers"
                  @keydown.enter.native="initUsers"></el-input>

        <el-button type="primary" icon="el-icon-search" @click="initUsers">搜索</el-button>
        <el-button type="primary">
          <i class="fa fa-angle-double-down" aria-hidden="true">高级搜索</i>
        </el-button>
      </div>
      <div>
        <el-button type="success">
          <i class="fa fa-level-up" aria-hidden="true">导入数据</i>
        </el-button>
        <el-button type="success">
          <i class="fa fa-level-down" aria-hidden="true">导出数据</i>
        </el-button>
        <el-button type="success" icon="el-icon-plus"
                   @click="showAddAdmin">
          添加用户
        </el-button>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between;margin-top: 10px">
      <div>
        <el-button type="info" round size="small" icon="el-icon-refresh-right"
                   @click="initUsers">
          刷新
        </el-button>
      </div>
    </div>
    <div>
      <el-table
          stripe
          broder
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          @selection-change="handleSelectionChange"
          :data="users"
          style="width: 100%; margin-top: 10px">

        <el-table-column align="left"
                         type="selection"
                         width="50">
        </el-table-column>
        <el-table-column align="left"
                         prop="id"
                         label="编号"
                         width="80">
        </el-table-column>
        <el-table-column align="left"
                         fixed
                         prop="username"
                         label="用户名"
                         width="110">
        </el-table-column>
        <el-table-column align="left"
                         prop="password"
                         label="密码"
                         width="180">
        </el-table-column>
        <el-table-column align="left"
                         prop="avatar_url"
                         label="头像url"
                         width="300">
        </el-table-column>
        <el-table-column align="left"
                         prop="created_by"
                         label="创建时间"
                         width="180">
        </el-table-column>
        <el-table-column align="left"
                         prop="created_by"
                         label="创建人"
                         width="100">
        </el-table-column>
        <el-table-column align="left"
                         prop="updated_at"
                         label="更新时间"
                         width="180">
        </el-table-column>
        <el-table-column align="left"
                         prop="updated_by"
                         label="更新人"
                         width="100">
        </el-table-column>
        <el-table-column align="center"
                         fixed="right"
                         label="操作"
                         width="200">
          <template slot-scope="scope">
            <el-button style="padding: 3px" type="primary" round
                       @click="showEditAdmin(scope.row)"
            >编辑
            </el-button>
            <el-button style="padding: 3px" type="danger" round
                       @click="deleteUser(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button type="danger" style="margin-top: 8px" size="small"
                 :disabled="this.multipleSelection.length===0" @click="deleteMany">批量删除
      </el-button>

      <div style="display: flex;justify-content: flex-end; margin-top: 10px">
        <el-pagination
            @current-change="currentChange"
            @size-change="sizeChange"
            @prev-click="prevPage"
            @next-click="nextPage"
            background
            layout="sizes, prev, pager, next, jumper, ->, total"
            :total="total">
        </el-pagination>
      </div>
    </div>

    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="45">
      <div>
        <el-form ref="userForm" :model="user" label-width="80px"
                 :rules="rules">
          <el-row :gutter="50">
            <el-col :span="24">
              <el-form-item label="用户名" prop="username">
                <el-input label="用户名"
                          placeholder="请输入用户名"
                          v-model="user.username">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50" style="margin-top: 10px">
            <el-col :span="24">
              <el-form-item label="密码" prop="password">
                <el-input label="密码"
                          placeholder="请输入密码"
                          v-model="user.password">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50" style="margin-top: 10px">
            <el-col :span="24">
              <el-form-item label="头像url" prop="avatar_url">
                <el-input label="头像url"
                          placeholder="请输入头像url"
                          v-model="user.avatar_url">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doAddOrEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      multipleSelection: [],
      loading: false,
      total: 0,
      users: [],
      pageNum: 1,
      pageSize: 10,
      queryParam: {
        username: '',
      },
      title: '',
      dialogVisible: false,
      user: {
        id: null,
        username: '',
        password: '',
        avatar_url: '',
      },
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
      },
    }
  },
  mounted() {
    this.initUsers();
  },
  methods: {
    doAddOrEdit() {
      if (this.title === '添加用户') {
        this.$refs['userForm'].validate(valid => {
          if (valid) {
            this.dialogVisible = false
            this.postRequest("/user", this.user).then(resp => {
              if (resp.code === 0) {
                this.initUsers()
              }
            })
          }
        })
      } else {
        this.$refs['userForm'].validate(valid => {
          if (valid) {
            this.dialogVisible = false
            this.putRequest("/user", this.user).then(resp => {
              if (resp.code === 0) {
                this.initUsers()
              }
            })
          }
        })
      }
    },
    initUsers() {
      this.loading = true;
      let url = '/user/?pageNum=' + this.pageNum + '&pageSize=' + this.pageSize;
      url += '&username=';
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp.code === 0) {
          this.users = resp.data.records;
          this.total = resp.data.total;
        }
      })
    },

    showAddAdmin() {
      this.user.id = null;
      this.user.username = ''
      this.user.password = ''
      this.title = '添加用户'
      this.dialogVisible = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    showEditAdmin(data) {
      this.title = '修改用户信息'
      this.user = JSON.parse(JSON.stringify(data))
      this.user.updated_at = null
      this.user.updated_by = null
      this.dialogVisible = true;
    },
    deleteUser(data) {
      this.$confirm('此操作将永久删除用户【' + data.username + '】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //?ids=1&ids=2&....
        this.deleteRequest('/user/?ids=' + data.id).then(resp => {
          if (resp.code === 0) {
            this.initUsers();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    deleteMany() {
      this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】名用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&';
        });
        this.deleteRequest('/user/' + ids).then(resp => {
          if (resp.code === 0) {
            this.initUsers();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    nextPage() {
      this.pageNum++;
      this.initUsers();
    },
    prevPage() {
      this.pageNum--;
      this.initUsers();
    },
    currentChange(currentPage) {
      this.pageNum = currentPage
      this.initUsers();

    },
    sizeChange(size) {
      this.pageSize = size
      this.initUsers();
    },
  }
}
</script>

<style>

</style>
