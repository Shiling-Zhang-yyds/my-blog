<template>
  <div id="home">
    <div  class="log" @click="log"><img src="src\assets\微信图片_20211019161551.jpg" alt="111"></div>
    <!-- <nav><button class="log" @click="log">写文章</button></nav> -->
    <header>主页</header>
    <!-- <section><img src="src\assets\vue.svg" alt="" />"https://api.isoyu.com/bing_images.php"</section> -->
    <section class="card"  v-for="item in blogs" :key="item.id" @click="jumpToDetail(item.id)" >
      <img :src="dsrc(item.id)" alt="" />
      <h3>{{ item.title }}</h3>
      <!-- <div class="content-wrapper">
        <div class="content">
          <p v-html="item.content"></p>
        </div>
      </div> -->
    </section>
    <n-back-top :right="100" />
    <footer>版权所有</footer>
  </div>
</template>

<script setup>
import Store from "../store";
import { ref, reactive, inject, onMounted, getCurrentInstance  } from "vue";
import { useRoute, useRouter } from "vue-router";
import editor from "../components/RichTextEditor/index.vue";
import { messageDark } from "naive-ui";
const router = useRouter();
const route = useRoute();
const store = Store();
const axios = inject("axios");
const message = inject("message");
const currentInstance = getCurrentInstance();

const dsrc = (id)=>{
  return `https://source.unsplash.com/900x600/?nature,${id}`;
}

const articles = reactive({
  title: "",
  content: "test",
  categoryId: 0,
});
const blogs = ref([]); // 所有的展示的博客

const jumpToDetail = (id) => {
  router.push({
    path: "/detail",
    query: {
      id,
    },
  });
};

const loadBlogs = async () => {
  let res = await axios.get("/blog/list");
  // console.log(res);
  blogs.value = [...res.data.rows];
  // console.log(blogs.value);
};
onMounted(() => {
  loadBlogs();
});

const log = () => {
  // console.log(store.loged);
  store.checkState();
  // console.log(store.loged);
  if (store.loged) {
    router.push('/home');
  }
  else{
    router.push("/login");
  }
  // router.push("/login");
};


</script>

<style lang="scss" scoped>
body {
  overflow-x: hidden;
}
*{
  box-sizing: border-box;
}
:root {
  font-size: 15px;
  font-family: "Courier New", Courier, monospace;
  --body-width: 480px;
  --card-width: 420px;
  --card-height: 280px;
  --img-height: 226px;
  --img-height-expanded: 320px;

  background-color: #333;
}

#home {
  width: var(--body-width);
  background-color: #eee;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 1rem 0;
  background: linear-gradient(-45deg, rgb(225, 190, 124), rgb(223, 130, 116));

}
header {
  font-size: 100px;
}
footer {
  font-size: 30px;
  
}
.log {
  position: fixed;
  top: 50px;
  left: 50px;
  img {
    width: 80px;
    border-radius: 10%;
  }
}

.card {
  width: var(--card-width);
  height: var(--card-height);
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 0.2rem 2rem rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
}

.card img {
  display: block;
  width: 100%;
  height: var(--img-height);
  object-fit: cover;

  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.card h3 {
  margin: 0;
  font: 1.5rem bold;
  padding: 0.8rem 1.5rem;
  background-color: #fff;
  line-height: 2rem;
  letter-spacing: -0.5px;
  // padding-bottom: 2px;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
}

.card .content-wrapper {
  height: 0;
  overflow: hidden;
}
.card .content-wrapper content {
  padding: 0 1.2rem;
  background-color: #fff;
  overflow: auto;
}




</style>

