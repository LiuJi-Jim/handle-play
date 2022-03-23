<template>
  <div
    class="flex justify-center items-center text-gray-800/60 hover:bg-gray-200/40 cursor-default select-none"
    :class="{
      [checkedClass]: checked,
    }"
    @click="$emit('update:checked', !checked)"
  >
    <slot name="default"></slot>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  checked: boolean;
  checkedClass: string;
}>();

defineEmits<{
  (e: 'update:checked', checked: boolean): void;
}>();
</script>
