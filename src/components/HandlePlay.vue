<template>
  <div class="w-[24rem] md:w-[36rem] mx-auto px-2 py-4">
    <NCollapse :default-expanded-names="['exact']">
      <NCollapseItem title="精准搜" name="exact">
        <div class="flex items-center justify-center gap-2">
          <HanziSelector
            v-for="(hanzi, i) in ruleSet.exact"
            :key="i"
            v-model:value="ruleSet.exact[i]"
          />
        </div>
      </NCollapseItem>

      <NCollapseItem title="模糊搜">
        <PartSelector
          v-model:rules="ruleSet.fuzzy"
          checked-class="!text-orange-300"
        />
      </NCollapseItem>

      <NCollapseItem title="排除搜">
        <NTabs type="line" size="small">
          <NTabPane tab="全局排除" name="exclude">
            <PartSelector
              v-model:rules="ruleSet.exclude"
              checked-class="!text-red-700"
            />
          </NTabPane>
          <NTabPane
            v-for="(neg, index) in ruleSet.negative"
            :key="index"
            :tab="`逐位排除-${index + 1}`"
            :name="`negative-${index + 1}`"
          >
            <PartSelector
              v-model:rules="ruleSet.negative[index]"
              checked-class="!text-red-700"
          /></NTabPane>
        </NTabs>
      </NCollapseItem>
    </NCollapse>

    <div class="text-center pt-4 mt-4 border-t border-gray-200">
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
  </div>

  <ResultPanel :result="result" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { NCollapse, NCollapseItem, NTabs, NTabPane } from 'naive-ui';
import { RuleSet } from '@/types';
import HanziSelector from './HanziSelector.vue';
import PartSelector from './PartSelector.vue';
import { useSearch } from '@/composables';
import { EMPTY_RULE } from '@/utils';

const ruleSet = reactive<RuleSet>({
  exact: [],
  fuzzy: [],
  exclude: [],
  negative: [],
});

for (let i = 0; i < 4; i++) {
  ruleSet.exact.push({
    ...EMPTY_RULE,
  });
  ruleSet.negative.push([]);
}

const { state: searchState, search, result } = useSearch(ruleSet);
</script>
