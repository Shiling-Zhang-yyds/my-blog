<template>
  <div>
    <n-table
    :bordered="false"
    :single-line="false"
    v-if="categoryList.length > 0"
  >
    <thead>
      <tr>
        <th>编号</th>
        <th>名称</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in categoryList" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>
          <n-space>
            <n-button @click="modifyItem(item)">修改</n-button>
            <n-button @click="handleConfirm(item)">删除</n-button>
          </n-space>
        </td>
      </tr>
    </tbody>
  </n-table>
  <div v-else>
    <!-- 提示没有内容，新增 -->
    <h1>没有内容</h1>
  </div>
  <n-button style="background:white;position:fixed;top:120px" @click="showModal = true">添加</n-button>

  <!-- 添加模态框 -->
  <n-modal v-model:show="showModal" preset="dialog" title="Dialog">
    <template #header> <div>添加分类</div></template>
    <div>
      <n-input
        v-model:value="addCategory.name"
        type="text"
        placeholder="请输入名称"
        autofocus:true
        @keydown.enter.prevent="add"
        id="add-cat"
      />
    </div>
    <template #action>
      <div>
        <n-button @click="add">提交</n-button>
      </div>
    </template>
  </n-modal>

  <!-- 修改模态框 -->
  <n-modal v-model:show="showModify" preset="dialog" title="Dialog">
    <template #header> <div>修改分类名称</div></template>
    <div>
      <input
        id="modinput"
        v-model="updateCategory.name"
        type="text"
        placeholder="请输入新名称"
        @keydown.enter.prevent="update"
      />
    </div>
    <template #action>
      <div>
        <n-button @click="update">修改</n-button>
      </div>
    </template>
  </n-modal>
  </div>
</template>

<script setup>
import Store from "../../store";
import {
  ref,
  reactive,
  inject,
  onMounted,
  getCurrentInstance,
  nextTick,
} from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const store = Store();
const axios = inject("axios");
const message = inject("message");
const dialog = inject("dialog");
const currentInstance = getCurrentInstance();
const categoryList = ref([]);
const showModal = ref(false);
const addCategory = reactive({
  name: "",
});

const showModify = ref(false);
const updateCategory = reactive({
  name: "",
  id: 0,
});

// 刷新页面信息
const loadData = async () => {
  let res = await axios.get("category/list");
  categoryList.value = res.data.rows;
};



onMounted(() => {
  loadData();
  console.log(currentInstance.ctx.$refs);
});

const modifyItem = (item) => {
  showModify.value = true;
  // setTimeout(() => {
  //   document.getElementById("modinput").focus();
  // }, 100);

  nextTick(() => {
    const inputEvent = document.getElementById("modinput");
    inputEvent.focus();
  });
  updateCategory.name = item.name;
  updateCategory.id = item.id;
};

const update = async () => {
  let res = await axios.put("category/_token/update", {
    name: updateCategory.name,
    id: updateCategory.id,
  });
  if (res.data.code == 200) {
    message.info("修改成功");
    showModify.value = false;
    loadData();
  } else {
    message.error("修改失败");
  }
};

// 删除某一项
const deleteItem = async (item) => {
  let res = await axios.delete(`category/_token/delete?id=${item.id}`);
  if (res.data.code == 200) {
    message.info("删除成功");
    loadData();
  } else {
    message.error("删除失败");
  }
};

const add = async () => {
  let res = await axios.post("category/_token/add", {
    name: addCategory.name,
  });
  message.info("添加成功");
  showModal.value = false;
  loadData();
};

// 删除弹出确认框
const handleConfirm = async (item) => {
  dialog.warning({
    title: "警告",
    content: "确定删除吗？",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: async () => {
      let res = await axios.delete(`category/_token/delete?id=${item.id}`);
      if (res.data.code == 200) {
        message.info("删除成功");
        loadData();
      } else {
        message.error("删除失败");
      }
    },
    onNegativeClick: () => {
      message.error("不确定");
    },
  });
};
</script>

<style lang="scss" scoped>
input {
  width: 100%;
  height: 40px;
  padding: 4px;
  border-radius: 10px;
}
</style>