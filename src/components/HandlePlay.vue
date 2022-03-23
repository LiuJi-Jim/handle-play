<template>
  <header
    class="h-16 flex items-center justify-center bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-10"
  >
    <div
      class="inline-flex items-center text-3xl font-medium text-gray-900 tracking-widest"
    >
      汉兜搜搜
    </div>
  </header>

  <div class="w-full sm:w-[30rem] md:w-[36rem] mx-auto px-2 pt-20 pb-16">
    <NCollapse :default-expanded-names="['exact', 'fuzzy', 'exclude']">
      <NCollapseItem title="绿色搜搜" name="exact">
        <NTabs type="line" size="small" justify-content="space-evenly">
          <NTabPane
            v-for="(_, index) in ruleSet.exact"
            :key="index"
            :tab="`第${index + 1}字`"
            :name="`exact-${index + 1}`"
          >
            <PartSelector
              v-model:rules="ruleSet.exact[index]"
              checked-class="!text-green-600 font-semibold"
              exclusive
            />
          </NTabPane>
        </NTabs>
      </NCollapseItem>

      <NCollapseItem title="橙色搜搜" name="fuzzy">
        <NTabs type="line" size="small" justify-content="space-evenly">
          <NTabPane
            v-for="(_, index) in ruleSet.fuzzy"
            :key="index"
            :tab="`第${index + 1}字`"
            :name="`fuzzy-${index + 1}`"
          >
            <PartSelector
              v-model:rules="ruleSet.fuzzy[index]"
              checked-class="!text-orange-300 font-semibold"
              :exclusive="false"
            />
          </NTabPane>
        </NTabs>
      </NCollapseItem>

      <NCollapseItem title="灰色搜搜" name="exclude">
        <PartSelector
          v-model:rules="ruleSet.exclude"
          checked-class="!text-gray-300"
          :exclusive="false"
        />
      </NCollapseItem>
    </NCollapse>
  </div>

  <div class="text-center bg-white fixed bottom-0 left-0 right-0">
    <button
      class="btn btn-primary py-2 text-xl flex w-full"
      :disabled="!searchState.ready || searchState.busy"
      @click="search"
    >
      <template v-if="!searchState.ready">载...</template>
      <template v-else-if="searchState.busy">搜...</template>
      <template v-else>搜!</template>
    </button>
  </div>

  <ResultPanel :result="result" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { NCollapse, NCollapseItem, NTabs, NTabPane } from 'naive-ui';
import { RuleSet } from '@/types';
import PartSelector from './PartSelector.vue';
import { useSearch } from '@/composables';

const ruleSet = reactive<RuleSet>({
  exact: [],
  fuzzy: [],
  exclude: [],
});

for (let i = 0; i < 4; i++) {
  ruleSet.exact.push([]);
  ruleSet.fuzzy.push([]);
}

const { state: searchState, search, result } = useSearch(ruleSet);
</script>
