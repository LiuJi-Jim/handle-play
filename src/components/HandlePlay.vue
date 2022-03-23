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

      <NCollapseItem title="模糊搜" name="fuzzy">
        <PartSelector
          v-model:rules="ruleSet.fuzzy"
          checked-class="!text-orange-300"
        />
      </NCollapseItem>

      <NCollapseItem title="排除搜" name="negative">
        <PartSelector
          v-model:rules="ruleSet.negative"
          checked-class="!text-red-700"
        />
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
import { NCollapse, NCollapseItem } from 'naive-ui';
import { RuleSet } from '@/types';
import HanziSelector from './HanziSelector.vue';
import PartSelector from './PartSelector.vue';
import { useSearch } from '@/composables';

const ruleSet = reactive<RuleSet>({
  exact: [],
  fuzzy: [],
  negative: [],
});

const { state: searchState, search, result } = useSearch(ruleSet);
</script>
