<template>
<div class="wrap">
  <div class="login-panel">
    <n-card title="管理后台登陆">
      <n-form :rules="rules" :model="admin">
        <n-form-item path="account" label="账号">
          <n-input v-model:value="admin.account" placeholder="请输入账号" />
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input v-model:value="admin.password" placeholder="请输入密码" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-checkbox v-model:checked="admin.remember" label="记住我" />
        <n-button @click="login">登录</n-button>
      </template>
    </n-card>
  </div></div>
</template>

<script setup>
import { ref, reactive, inject } from "vue";
import AdminStore from "../store";

import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();

const adminstore = AdminStore();
const axios = inject("axios");
const message = inject("message");

// 验证规则
let rules = {
  account: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 3, max: 12, message: "账号长度在 3 到 12 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 18, message: "账号长度在 6 到 18 个字符", trigger: "blur" },
  ],
};

const admin = reactive({
  account: localStorage.getItem("account") || "",
  password: localStorage.getItem("password") || "",
  remember: localStorage.getItem("remember") == 1,
});

const login = async () => {
  let result = await axios.post("/admin/login", {
    account: admin.account,
    password: admin.password,
  });
  console.log(result);
  if (result.data.code == 200) {
    adminstore.token = result.data.data.token;
    adminstore.account = result.data.data.account;
    adminstore.id = result.data.data.id;

    if (admin.remember) {
      localStorage.setItem("account", admin.account);
      localStorage.setItem("password", admin.password);
      localStorage.setItem("remember", admin.remember ? 1 : 0);
    }
    router.push("/home");

    message.info("登陆成功");
  } else {
    message.error("登陆失败");
  }
};
</script>

<style scoped>

.wrap{
  position: relative;
  height: 100vh;
  width: 100vw;
}

.login-panel {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  height: 40%;
}
</style>