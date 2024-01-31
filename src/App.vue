<template>
  <div class="table-box">
    <!--标题-->
    <div class="title">
      <h2>最简单的 CRUD Demo</h2>
    </div>
    <!-- query -->
    <div class="query-box">
      <el-input class="query-input" v-model="queryInput" placeholder="请输入姓名进行搜索" />
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
/*方法*/
/*const handleRowClick =()=>{
  console.log('click')
}*/
//选中
const handleSelectionChange = (val) => {
  // multipleSelection.value = val
  // console.log(val);
  multipleSelection.value=[]//清空数据
  val.forEach(item=>{
    multipleSelection.value.push(item.id)
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
const dialogConfirm=()=>{
  dialogFormVisible.value=false
  //判断是编辑还是新增
  if (dialogType.value === 'add'){
    //1.拿到数据
    //2.添加到table
    tableData.value.push({
      id:(tableData.value.length+1).toString(),
      ...tableForm.value
    })
  }else {
    //1.获取到当前的这条的索引
    let index =tableData.value.findIndex(item => item.id === tableForm.value.id)
    tableData.value[index]=tableForm.value
    //2.替换当前索引值对应的数据
  }

}
//删除一条
const handleRowDel=({id})=>{
  console.log(id)
  //1.通过id获取条目对应的索引值
  let index=tableData.value.findIndex(item=>item.id===id)
  console.log(index);
  //2.通过索引值删除对应条目
  tableData.value.splice(index,1);
}
//选中删除
const handleDelList=()=>{
  multipleSelection.value.forEach(id=>{
    handleRowDel({id})
  })
  multipleSelection.value=[]
}
//编辑
const handleEdit=(row)=>{
  dialogFormVisible.value=true
  dialogType.value = 'edit'
  tableForm.value = {...row}


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