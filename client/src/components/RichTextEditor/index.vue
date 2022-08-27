<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 500px; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>
<script setup>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted, inject } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

const server_url = inject("server_URL");
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

const toolbarConfig = { excludeKeys:["uploadVideo"] };
const editorConfig = { placeholder: "请输入内容..." };
editorConfig.MENU_CONF = {};
editorConfig.MENU_CONF["uploadImage"] = {
  base64LimitSize: 10 * 1024, // 5kb以下的图片就不上传，直接变为BASE64编码
  server: server_url+'/upload/rich_editor_upload',
};
editorConfig.MENU_CONF["insertImage"] = {
  parseImageSrc: (src) => {
    if (src.indexOf("http") !== 0) {
      return `${server_url}${src}`;
    }
    return src;
  },
};

const mode = ref("default");
const inited = ref(false);
// 内容 HTML
const valueHtml = ref("");

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:model-value"]);

// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    valueHtml.value = props.modelValue;
    inited.value = true;
  }, 10);
});

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

const handleChange = (editor) => {
  if (inited.value == true) {
    emit("update:model-value", valueHtml.value);
  }
};
</script>    