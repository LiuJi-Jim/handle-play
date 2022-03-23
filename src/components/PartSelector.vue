<template>
  <div class="space-y-1">
    <div class="flex items-center">
      <div class="px-2">声调</div>
      <div class="flex-1 flexible-grid">
        <PartCheckbox
          v-for="tone in [1, 2, 3, 4]"
          :key="tone"
          :checked="getChecked('tone', tone)"
          :checked-class="checkedClass"
          @update:checked="(checked) => setChecked('tone', tone, checked)"
        >
          <ToneSymbol :tone="tone" class="w-4 h-4" />
        </PartCheckbox>
      </div>
    </div>
    <div class="flex items-start">
      <div class="px-2 pt-0.5">声母</div>
      <div class="flex-1 flexible-grid">
        <PartCheckbox
          v-for="initial in pinyinInitials"
          :key="initial"
          :checked="getChecked('initial', initial)"
          :checked-class="checkedClass"
          @update:checked="(checked) => setChecked('initial', initial, checked)"
        >
          <span class="p-0.5">{{ initial }}</span>
        </PartCheckbox>
      </div>
    </div>
    <div class="flex items-start">
      <div class="px-2 pt-0.5">韵母</div>
      <div class="flex-1 flexible-grid">
        <PartCheckbox
          v-for="final in pinyinFinals"
          :key="final"
          :checked="getChecked('final', final)"
          :checked-class="checkedClass"
          @update:checked="(checked) => setChecked('final', final, checked)"
        >
          <span class="p-0.5">{{ final.replace('v', 'ü') }}</span>
        </PartCheckbox>
      </div>
    </div>
    <div v-if="false" class="flex items-start">
      <div class="px-2 pt-0.5">文字</div>
      <div class="flex-1 px-1">
        <input
          type="text"
          class="textbox w-full"
          :value="getZi()"
          @change="(e: any) => setZi(e.target.value)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { pinyinInitials, pinyinFinals } from '@/logic/pinyin-constants';
import { Rule } from '@/types';
import ToneSymbol from './ToneSymbol.vue';
import PartCheckbox from './PartCheckbox.vue';
import { cloneDeep } from 'lodash-es';
import { EMPTY_RULE } from '@/utils';

const props = defineProps<{
  rules: Rule[];
  checkedClass: string;
  exclusive: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:rules', rules: Rule[]): void;
}>();
function getChecked<K extends keyof Rule>(key: K, value: Rule[K]): boolean {
  return props.rules.some((rule) => rule[key] === value);
}

function setChecked<K extends keyof Rule>(
  key: K,
  value: Rule[K],
  checked: boolean
): void {
  const index = props.rules.findIndex((rule) => rule[key] === value);
  if (checked) {
    if (index >= 0) {
      throw 'should never reach';
    } else {
      let rules = cloneDeep(props.rules);
      if (props.exclusive) {
        rules = rules.filter((rule) => !rule[key]);
      }
      rules.push({
        ...EMPTY_RULE,
        [key]: value,
      });
      emit('update:rules', rules);
    }
  } else {
    if (index < 0) {
      throw 'should never reach';
    } else {
      const rules = cloneDeep(props.rules);
      rules.splice(index, 1);
      emit('update:rules', rules);
    }
  }
}

const getZi = () => {
  return props.rules
    .filter((rule) => !!rule.zi)
    .map((rule) => rule.zi || '')
    .join('');
};

const setZi = (input: string) => {
  const rules = cloneDeep(props.rules).filter((rule) => !rule.zi);
  const zis = input
    .trim()
    .split('')
    .map((zi) => ({
      ...EMPTY_RULE,
      zi,
    }));
  emit('update:rules', [...rules, ...zis]);
};
</script>
