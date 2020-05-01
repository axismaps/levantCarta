<template>
  <div style="display:flex">
    <div
      v-for="tag in tagsObjects"
      :key="tag.key"
      style="display: flex; align-items: center; margin-right: 10px"
    >
      <font-awesome-icon :style="tag.style" :icon="['fas', 'circle']" />
      <p style="margin-left: 5px">{{tag.name}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      default: ['deleted', 'original', 'edited', 'unchanged']
    }
  },
  computed: {
    tagsObjects() {
      return this.tags.map(tag => {
        switch (tag) {
          case 'created':
            return { style: { color: '#2DB84B' }, name: 'Created' };
          case 'deleted':
            return { style: { color: '#E35A5A' }, name: 'Deleted' };
          case 'original':
            return { style: { color: '#5A6FE3' }, name: 'Original' };
          case 'edited':
            return { style: { color: '#2DB84B' }, name: 'Edited' };
          case 'unchanged':
            return { style: { color: '#CBD5E0' }, name: 'Unchanged' };
          case 'uncreated':
            return { style: { color: '#CBD5E0' }, name: 'Uncreated' };
          case 'unedited':
            return { style: { color: '#CBD5E0' }, name: 'Unedited' };

          default:
            break;
        }
      });
    }
  }
};
</script>

<style scoped>
</style>