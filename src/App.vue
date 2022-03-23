<template>
  <div class="text-center">
    <header
      class="h-16 flex items-center justify-center bg-white border-b border-gray-200"
    >
      <div
        class="inline-flex items-center text-3xl font-medium text-gray-900 tracking-widest"
      >
        汉兜搜搜
      </div>
    </header>

    <HandlePlay />
  </div>
</template>

<script lang="ts" setup>
import HandlePlay from './components/HandlePlay.vue';
</script>
