<template>
  <div class="skeleton-wrap">
    <a-card :bordered="false" class="page-card">
      <a-table :columns="columns" :data-source="skeletonData" :pagination="false" rowKey="key" size="middle">
        <template #bodyCell="{ column }">
          <a-skeleton :paragraph="{ rows: 1, width: column.width || 100 }" :active="true" />
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  columns: {
    type: Array,
    default: () => []
  },
  rowCount: {
    type: Number,
    default: 5
  }
});

const skeletonData = computed(() => {
  return Array.from({ length: props.rowCount }, (_, i) => ({ key: i }));
});
</script>
