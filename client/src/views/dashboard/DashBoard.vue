<template>
  <div class="main-panel">
    <div class="menu">
      <div class="img-wrap">
        <img
          src="src\assets\微信图片_20211019161551.jpg"
          alt="头像"
          @click="router.push('/')"
        />
      </div>
      <div class="tab-wrap">
        <div v-for="item in menu" @click="toPage(item)" :key="item.href">
          {{ item.name }}
        </div>
      </div>
    </div>
    <div style="padding: 20px; width: 100%">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import Store from "../../store";
import { ref, reactive, inject } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const store = Store();
const axios = inject("axios");
const message = inject("message");

let menu = [
  { name: "文章管理", href: "/home/article" },
  { name: "分类管理", href: "/home/category" },
  { name: "退出登录", href: "logout" },
];

const toPage = (menu) => {
  if (menu.href == "logout") {
    localStorage.removeItem('account');
    localStorage.removeItem('password');
    store.outState();
    router.push("/");
  } else {
    router.push(menu.href);
  }
};
</script>

<style lang="scss" scoped>
.main-panel {
  // display: flex;
  color: #64676a;
  max-width: 1500px;
  margin: 0 auto;
}
.img-wrap {
  img {
    border-radius: 10px;
  }
  // overflow: hidden;
}
img {
  width: 50px;
  height: 50px;
}
.menu {
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 20px;
  right: 30px;
  color: white;
  box-sizing: border-box;
  // line-height: 55px;
  text-align: center;
  width: 100%;
  .tab-wrap {
    display: flex;
    justify-content: space-around;
    padding: 20px 0;
    align-items: center;
    div {
      padding: 20px;
      cursor: pointer;
      &:hover {
        color: #fd760e;
      }
    }
  }
}
</style>