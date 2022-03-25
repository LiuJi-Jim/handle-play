<template>
  <NDrawer v-model:show="state.show" :width="320">
    <NDrawerContent
      closable
      :body-content-style="{
        padding: 0,
      }"
    >
      <template #header>
        <div class="flex items-center gap-2">
          <span>搜出来这些</span>
          <span v-if="resultList.length > 0" class="text-gray-700/50">
            ({{ resultList.length }})
          </span>
          <button class="icon-btn" @click="state.sort = !state.sort">
            <mdi:sort-ascending
              class="w-5 h-5 mt-[2px]"
              :class="{
                'text-green-500': state.sort,
              }"
            />
          </button>
        </div>
      </template>
      <VirtualList
        v-if="resultList.length > 0"
        key="word"
        :item-size="44"
        :items="resultList"
        class="mt-2 text-center max-h-full"
      >
        <template #default="{ item }">
          <div class="h-[44px] flex items-center justify-center gap-1">
            <span>
              {{ item.word }}
            </span>
            <span class="text-gray-700/50"> ({{ item.freq }}) </span>
          </div>
        </template>
      </VirtualList>
      <div v-else class="pt-10 text-center text-base text-gray-500/80">
        啥也没有（这不是成语）
      </div>
    </NDrawerContent>
  </NDrawer>
</template>

<script lang="ts" setup>
import { computed, reactive, watch } from 'vue';
import { NDrawer, NDrawerContent } from 'naive-ui';
import { VirtualList } from 'vueuc';
import { WordWithFreq } from '@/types';

const props = defineProps<{
  result: WordWithFreq[] | null;
}>();

const state = reactive({
  show: false,
  sort: false,
});

const resultList = computed((): WordWithFreq[] => {
  if (!props.result) return [];
  if (state.sort) {
    const list = [...props.result];
    list.sort((a, b) => -(a.freq - b.freq));
    return list;
  } else {
    return props.result;
  }
});

watch(
  () => props.result,
  (result) => {
    if (result) state.show = true;
  },
  { immediate: true }
);
</script>
