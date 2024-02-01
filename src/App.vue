<template>
  <div class="table-box">
    <!--标题-->
    <div class="title">
      <h2>最简单的 CRUD Demo</h2>
    </div>
    <!-- query -->
    <div class="query-box">
      <el-input class="query-input" v-model="queryInput" placeholder="请输入姓名进行搜索" @change="handleQueryName"/>
      <div class="btn-list">
        <el-button type="primary" @click="handleAdd">增加</el-button>
        <el-button type="danger" @click="handleDelList" v-if="multipleSelection.length>0">多选删除</el-button>
      </div>
    </div>
    <!--  table-->
    <el-table   ref="multipleTableRef"
                :data="tableData"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                border>
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="email" label="邮箱" width="120" />
      <el-table-column prop="phone" label="电话" width="120" />
      <el-table-column prop="state" label="状态" width="120" />
      <el-table-column prop="address" label="地址" width="300" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleRowDel(scope.row)" style="color: #F56C6C">删除</el-button>
          <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        background
        layout="prev, pager, next"
        style="display: flex;justify-content: center;margin-top: 10px;"
        :total="total"
        v-model:current-page="curPage"
        @current-change="handleChangePage"
        /><!--分页-->
    <!--  dialog-->
    <el-dialog v-model="dialogFormVisible" :title="dialogType==='add'?'新增':'编辑'">
      <el-form :model="tableForm">
        <el-form-item label="姓名" :label-width="80">
          <el-input v-model="tableForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="邮箱" :label-width="80">
          <el-input v-model="tableForm.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="电话" :label-width="80">
          <el-input v-model="tableForm.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="状态" :label-width="80">
          <el-input v-model="tableForm.state" autocomplete="off" />
        </el-form-item>
        <el-form-item label="地址" :label-width="80">
          <el-input v-model="tableForm.address" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogConfirm">确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>

import {ref} from "vue";
import request from "./utils/request.js";
/*数据*/
let queryInput = ref("")
let tableData =ref([
  {
    id: '1',
    name: 'Tom1',
    email: '123@163.com',
    phone: '1889937656',
    state: 'California',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: '2',
    name: 'Tom2',
    email: '123@163.com',
    phone: '1889937656',
    state: 'California',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: '3',
    name: 'Tom3',
    email: '123@163.com',
    phone: '1889937656',
    state: 'California',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: '4',
    name: 'Tom4',
    email: '123@163.com',
    phone: '1889937656',
    state: 'California',
    address: 'No. 189, Grove St, Los Angeles',
  },
])
let tableDataCopy = Object.assign(tableData.value)
let multipleSelection=ref([])
let tableForm =ref({
  name:'梨花',
  email:'123@163.com',
  phone:'19076558209',
  state:'在职',
  address:'上海市 黄河路 163号'
})
let dialogFormVisible=ref(false)
let dialogType=ref('add')
let total =ref(10)
let curPage =ref(1)
/*方法*/
//获取数据
const getTableData =async (cur=1)=>{
  //第一种请求方式更加直观（推荐）
  let res=await request.get('/list',{
    pageSize : 10,
    pageNum :cur
  })
  console.log(res);
  tableData.value=res.list
  total.value=res.total
  curPage.value=res.pageNum
  //第二种请求方式比较杂乱（不推荐）
  //let res=request.get(`user/list?PageNum=${cur}&PageSize=10`)
}
getTableData(1)//启用方法

/*请求分页*/
const handleChangePage=(val)=>{
  getTableData(curPage.value)
}






/*const handleRowClick =()=>{
  console.log('click')
}*/
//选中
const handleSelectionChange = (val) => {
  multipleSelection.value=[]//清空数据
  val.forEach(item=>{
    multipleSelection.value.push(item.ID)
  })
  console.log(multipleSelection.value)
}
//新增
const handleAdd=()=>{
  dialogFormVisible.value=true
  console.log(dialogFormVisible.value)
  tableForm.value={}
  dialogType.value = 'add'
}
//确认
const dialogConfirm=async ()=>{
  dialogFormVisible.value=false
  //判断是编辑还是新增
  if (dialogType.value === 'add'){
    //添加数据
    await request.post('/add',{
      ...tableForm.value
    })
    //刷新数据
    await getTableData(curPage.value)
  }else {
    //修改数据
    await request.put(`/update/${tableForm.value.ID}`,{
      ...tableForm.value
    })
    //刷新数据
    await getTableData(curPage.value)
  }
}
//删除一条(这里的id不能小写拿不到数据后台控制器上的id为大写，这里request方法有点问题，需要改进，具体问题为http请求的问题‘delect’)
const handleRowDel=async ({ID})=>{
  await request.delete(`/delete/${ID}`)
  await getTableData(curPage.value)
}
//选中删除
const handleDelList=()=>{
  multipleSelection.value.forEach(ID=>{
    handleRowDel({ID})
  })
  multipleSelection.value=[]
}
//编辑
const handleEdit=(row)=>{
  dialogFormVisible.value=true
  dialogType.value = 'edit'
  tableForm.value = {...row}


}
//搜索
const handleQueryName =async (val)=>{
  if (val.length>0) {
   tableData.value= await request.get(`/list/${val}`)
  }else {
    await getTableData(curPage)
  }
}
</script>


<style scoped>
.table-box{
  margin:200px auto;
  width: 800px;
  /*position:absolute;
  top: 50%;
  left:50%;
  transform: translate(-50%,-50%);*/
}
.title{
  text-align: center;
}
.query-box{
  display: flex;
  justify-content: space-between;
}
.query-input{
  width: 200px;
  margin-bottom: 20px;
}
</style>