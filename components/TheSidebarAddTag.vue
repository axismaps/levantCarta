<template>
  <el-form-item :label="$t('sidebar.tag')" prop="tags" size="mini">
    <el-card shadow="never" class="add-tag-card" :body-style="{ padding: '0px' }">
      <div slot="header" style="line-height: 0px">
        <el-checkbox>
          <span>{{$t('sidebar.tags.name')}}</span>
        </el-checkbox>
        <span style="padding-left: 85px">{{$t('sidebar.tags.value')}}</span>
      </div>
      <div v-if="tags.length" style="margin: 20px">
        <div v-for="tag in tags" :key="tag.id" class="tag">
          <el-checkbox>
            <el-input v-model="tag.name" @change="updateTags" />
            <el-input v-model="tag.value" @change="updateTags" />
          </el-checkbox>
        </div>
      </div>
      <el-button class="add-tag" icon="el-icon-plus" @click="pushNewTag">{{$t('sidebar.newTagBtn')}}</el-button>
    </el-card>
  </el-form-item>
</template>

<script>
export default {
  props: {
    initialTags: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tags: []
    };
  },
  methods: {
    pushNewTag() {
      this.tags.push({ id: this.tags.length + 1, name: '', value: '' });
    },
    updateTags() {
      this.$emit('update-tags', this.tags);
    }
  },
  watch: {
    initialTags(newValue, oldValue) {
      this.tags = JSON.parse(JSON.stringify(this.initialTags));
    }
  },
  created() {
    this.tags = JSON.parse(JSON.stringify(this.initialTags));
  }
};
</script>

<style lang="scss" scoped>
.add-tag-card {
  .add-tag {
    width: 100%;
    border: none;
    border-radius: 0px;
    border-top: 1px solid #dcdfe6;
    text-align: left;
    padding: 15px 15px;
  }
  .tag {
    width: 135px;
    padding-bottom: 10px;
  }
}
</style>