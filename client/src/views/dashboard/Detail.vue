<template>
  <div class="detail">
    <n-button class="btn" @click="back">返回</n-button>
    <h1>{{ blogInfo.title }}</h1>
    <h4>创建日期：{{ timestampToTime(blogInfo.create_time) }}</h4>
    <hr />
    <div v-html="blogInfo.content"></div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const blogInfo = ref({});
const axios = inject("axios");

onMounted(() => {
  loadDetail();
});

// 返回上一页
const back = function () {
  router.go(-1);
};

const time = ref("");

function timestampToTime(timestamp) {
  var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  var h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var m =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}

const loadDetail = async () => {
  console.log(route.query.id);
  let res = await axios.get(`/blog/detail?id=${route.query.id}`);
  console.log(res);
  blogInfo.value = res.data.rows[0];
};
</script>

<style lang="scss" scoped>
.detail {
  height: 100vh;
  color: #fff;

  background: linear-gradient(rgb(120, 115, 115), rgb(209, 222, 209));

  h1 {
    font-size: 100px;
    text-align: center;
  }
  div {
    font-size: 50px;
  }

  .btn {
    position: fixed;

    top: 10px;
    left: 10px;
    // border: ;
    width: 100px;
    background: #fff;
  }
}
</style>