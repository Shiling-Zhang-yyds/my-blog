<template>
  <div class="test">
    <n-tabs default-value="oasis" type="line" animated>
    <n-tab-pane name="oasis" tab="所有博客">
      <div>
        <n-card class="wrap-article">
          <div class="article-item" v-for="item in blogs" :key="item.id" id="item-blog">
            <h1 @click="jumpToDetail(item.id)">{{ item.title }}</h1>
            <button class="deletebtn" @click="deleteEssay(item.id)">删除</button>
            <p :v-html="articles.content"></p>
          </div>
        </n-card>
      </div>
    </n-tab-pane>
    <n-tab-pane name="add" tab="写文章">
      <n-form>
        <n-form-item label="标题">
          <n-input
            v-model:value="articles.title"
            @keydown.enter.prevent
            placeholder="输入标题"
          />
        </n-form-item>
        <n-form-item label="分类">
          <n-select v-model.value="articles.categoryId" :options="options" />
        </n-form-item>
        <n-form-item label="内容">
          <editor v-model="articles.content"></editor>
        </n-form-item>
        <n-form-item label="">
          <n-button @click="add">提交</n-button>
        </n-form-item>
      </n-form>
    </n-tab-pane>
    <!-- <n-tab-pane name="jay chou" tab="周杰伦"> 七里香 </n-tab-pane> -->
  </n-tabs>
  </div>
</template>
<!-- src\components\RichTextEditor\index.vue -->
<script setup>
import Store from "../../store";
import { ref, reactive, inject, onMounted, defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import editor from "../../components/RichTextEditor/index.vue";
import { messageDark } from "naive-ui";
const router = useRouter();
const route = useRoute();
const store = Store();
const axios = inject("axios");
const message = inject("message");

const articles = reactive({
  title: "",
  content: "test",
  categoryId: 0,
});

const options = ref([]);
onMounted(() => {
  loadBlogs();
  loadCategories();
});
const loadCategories = async function () {
  let res = await axios.get("category/list");
  // console.log([...res.data.rows]);
  options.value = res.data.rows.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
};

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

const add = async () => {
  let res = await axios.post("blog/_token/add", articles);
  if (res.data.code == 200) {
    message.info(res.data.msg);
    loadBlogs();
  } else {
    message.error(res.data.msg);
  }
};

//删除该文章
const deleteEssay = async (id) => {
  // console.log(id);
  let res = await axios.delete("blog/_token/delete", { data: { id } });
  // alert(res)
  if (res.data.code == 200) {
    message.info(res.data.msg);
    loadBlogs();
  } else {
    message.error(res.data.msg);
  }
};
</script>

<style lang="scss" scoped>
#item-blog {
  box-sizing: border-box;
  padding: 20px 20px;
}
.wrap-article {
 background-color: rgb(151, 229, 228);
  display: flex;
  justify-content: start;
  // align-items: center;
}
.deletebtn {
  position: absolute;
  right: 40px;
  transform: translateY(-40px);
  // top: ;
}
.article-item {
  border: 2px white solid;
  background-color: grey;
}
</style>