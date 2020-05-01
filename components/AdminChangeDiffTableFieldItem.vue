<template>
  <div>
    <p class="item" style="border-radius: 5px; " :style="style">
      <slot></slot>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'created'
    }
  },
  computed: {
    style() {
      switch (this.type) {
        case 'created':
          return { 'background-color': '#2DB84B33' };
        case 'deleted':
          return {
            'background-color': '#E35A5A33',
            'text-decoration': 'line-through'
          };
        case 'original':
          return {
            'background-color': '#5A6FE333',
            'text-decoration': 'line-through'
          };
        case 'edited':
          return { 'background-color': '#2DB84B33' };

        case 'unchanged':
          return { 'background-color': '#E2E8F0' };
        case 'uncreated':
          return {
            'background-color': '#2DB84B33',
            'text-decoration': 'line-through'
          };
        case 'unedited':
          return {
            'background-color': '#2DB84B33',
            'text-decoration': 'line-through'
          };
        default:
          return { 'background-color': '#2DB84B33' };

          break;
      }
    }
  }
};
</script>

<style scoped>
.item {
  border-radius: 5px;
  padding: 5px 10px;
}
</style>