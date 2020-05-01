<template>
  <div style="display: flex; align-items: center;">
    <fieldItem
      style="margin-right: 10px"
      v-for="item in items"
      :key="item.key"
      :type="item.type"
    >{{item.value}}</fieldItem>
  </div>
</template>

<script>
import AdminChangeDiffTableFieldItem from '@/components/AdminChangeDiffTableFieldItem.vue';

export default {
  components: {
    fieldItem: AdminChangeDiffTableFieldItem
  },
  props: {
    items: {
      type: Array,
      default: [{ type: 'created', value: '1810' }]
    }
  }
};
</script>

<style scoped>
</style>