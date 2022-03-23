<template>
  <div class="w-20 flex flex-col justify-center gap-2">
    <div class="flex items-center justify-center">
      <NPopselect
        :options="mapOptions(['', '1', '2', '3', '4'])"
        :render-label="renderToneOption"
        :value="value.tone"
        @update-value="changeTone"
      >
        <button class="h-6 px-2 btn" tabindex="-1">
          <span v-if="!value.tone" class="text-xs text-gray-500/70">?</span>
          <ToneSymbol v-else :tone="value.tone" class="w-2 h-2" />
        </button>
      </NPopselect>
    </div>

    <div class="flex items-center justify-space-between gap-1">
      <NPopselect
        :options="mapOptions(['', ...pinyinInitials])"
        :value="value.initial"
        :render-label="renderInitialOption"
        scrollable
        tabindex="-1"
        @update-value="changeInitial"
      >
        <button class="h-6 flex-[1] btn" tabindex="-1">
          <span v-if="!value.initial" class="text-xs text-gray-500/70">?</span>
          <span v-else>{{ value.initial }}</span>
        </button>
      </NPopselect>
      <NPopselect
        :options="mapOptions(['', ...pinyinFinals])"
        :value="value.final"
        :render-label="renderFinalOption"
        scrollable
        tabindex="-1"
        @update-value="changeFinal"
      >
        <button class="h-6 flex-[2] btn" tabindex="-1">
          <span v-if="!value.final" class="text-xs text-gray-500/70">?</span>
          <span v-else>{{ value.final.replace('v', 'ü') }}</span>
        </button>
      </NPopselect>
    </div>

    <div>
      <input
        type="text"
        class="w-full h-20 text-4xl text-center border border-gray-500/20 focus:border-gray-500/60 outline-none"
        :value="value.zi"
        @compositionstart="state.compositing = true"
        @compositionend="state.compositing = false"
        @keyup="(e: any) => changeZi(e.target.value)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { h, reactive } from 'vue';
import { NPopselect, SelectOption } from 'naive-ui';
import { pinyinInitials, pinyinFinals } from '@/logic/pinyin-constants';
import { ParsedHanzi } from '@/types';
import ToneSymbol from './ToneSymbol.vue';

const props = defineProps<{
  value: Partial<ParsedHanzi>;
}>();

const emit = defineEmits<{
  (e: 'update:value', value: Partial<ParsedHanzi>): void;
}>();

const state = reactive({
  compositing: false,
});

const mapOptions = (values: string[]) => {
  return values.map((value) => {
    return { value, label: value } as SelectOption;
  });
};

const renderToneOption = (option: SelectOption) => {
  const value = option.value as string;
  if (value === '') return h('div', { innerHTML: '?' });
  return h(ToneSymbol, { tone: parseInt(value, 10), class: 'w-2 h-2' });
};

const renderInitialOption = (option: SelectOption) => {
  const value = option.value as string;
  return h('div', { innerHTML: value || '?' });
};

const renderFinalOption = (option: SelectOption) => {
  const value = option.value as string;
  return h('div', { innerHTML: value ? value.replace('v', 'ü') : '?' });
};

const changeTone = (val: string) => {
  if (val === '') emit('update:value', { ...props.value, tone: undefined });
  else emit('update:value', { ...props.value, tone: parseInt(val, 10) });
};

const changeInitial = (val: string) => {
  if (val === '') emit('update:value', { ...props.value, initial: undefined });
  else emit('update:value', { ...props.value, initial: val });
};

const changeFinal = (val: string) => {
  if (val === '') emit('update:value', { ...props.value, final: undefined });
  else emit('update:value', { ...props.value, final: val });
};

const changeZi = (val: string) => {
  if (state.compositing) return;
  val = val.trim();
  if (val === '') emit('update:value', { ...props.value, zi: undefined });
  else emit('update:value', { ...props.value, zi: val });
};
</script>
