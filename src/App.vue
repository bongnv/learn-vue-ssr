<template>
  <div id="app">
    <div class="main">
      <h1>This is a title</h1>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  metaInfo: {
    meta: [{ charset: "utf-8" }]
  }
};
</script>
