<template>
  <div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 28px">
      <div>
        <h3 style="margin: 14px 0px">Geography</h3>
        <admin-change-diff-tags :tags="geometryTags" />
      </div>
      <div>
        <h3 style="margin: 14px 0px">Attritubes</h3>
        <admin-change-diff-tags :tags="attritubeTags" />
        <div style="margin: 14px 0px" class="attritubes-table">
          <span class="div1 grid-table-name">From</span>
          <span class="div2">
            <tableField
              :items="generateTag(originalFeature.properties.firstyear, newFeature.properties.firstyear)"
            />
          </span>
          <span class="div3 grid-table-name">To</span>
          <span class="div4">
            <tableField
              :items="generateTag(originalFeature.properties.lastyear, newFeature.properties.lastyear)"
            />
          </span>
          <span class="div5 grid-table-name">Type</span>
          <span class="div6">
            <tableField
              :items="generateTag(originalFeature.properties.type, newFeature.properties.type)"
            />
          </span>
          <span class="div7 grid-table-name">Tags</span>
          <span class="div8 grid-table-name">Name</span>
          <span class="div9 grid-table-name">Value</span>
          <div
            v-for="(tag, index) in newFeature.properties.tags"
            :key="tag.key"
            style="display: contents"
          >
            <span class="grid-table-name"></span>
            <span style="border-right: 1px solid #ccd0d8; border-bottom: 1px solid #ccd0d8;">
              <tableField
                :items="generateTag(originalFeature.properties.tags[index].name, tag.name)"
              />
            </span>
            <span style="border-bottom: 1px solid #ccd0d8;">
              <tableField
                :items="generateTag(originalFeature.properties.tags[index].value, tag.value)"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminChangeDiffTags from '@/components/AdminChangeDiffTags';
import AdminChangeDiffTableField from '@/components/AdminChangeDiffTableField.vue';

export default {
  components: {
    AdminChangeDiffTags,
    tableField: AdminChangeDiffTableField
  },
  data() {
    return {
      editType: 'edit'
    };
  },
  props: {
    _editType: {
      type: String
    },
    originalFeature: {
      type: Object
    },
    newFeature: {
      type: Object
    }
  },
  computed: {
    geometryTags() {
      switch (this.editType) {
        case 'create':
          return ['created'];
        case 'delete':
          return ['deleted'];
        case 'edit':
          return ['original', 'edited'];
          break;
        default:
          break;
      }
    },
    attritubeTags() {
      switch (this.editType) {
        case 'create':
          return ['created'];
        case 'delete':
          return ['deleted'];
        case 'edit':
          return ['original', 'edited', 'unchanged'];
          break;
        default:
          break;
      }
    }
  },
  methods: {
    generateTag(originalValue, newValue) {
      const type = this.editType;
      switch (type) {
        case 'create':
          return [{ type: 'created', value: newValue }];
          break;
        case 'delete':
          return [{ type: 'deleted', value: newValue }];
        case 'edit':
          if (!newValue) {
            return [{ type: 'deleted', value: newValue }];
          } else if (newValue !== originalValue) {
            return [
              { type: 'original', value: originalValue },
              { type: 'edited', value: newValue }
            ];
          } else {
            return [{ type: 'unchanged', value: originalValue }];
          }

        default:
          break;
      }
    }
  }
};
</script>

<style scoped>
.attritubes-table {
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  grid-template-rows: repeat(4, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid #ccd0d8;
}

.attritubes-table span {
  padding: 10px;
}

.div1 {
  grid-area: 1 / 1 / 2 / 2;
  border-right: 1px solid #ccd0d8;
  border-bottom: 1px solid #ccd0d8;
}
.div2 {
  grid-area: 1 / 2 / 2 / 4;
  border-bottom: 1px solid #ccd0d8;
}
.div3 {
  grid-area: 2 / 1 / 3 / 2;
  border-right: 1px solid #ccd0d8;
  border-bottom: 1px solid #ccd0d8;
}
.div4 {
  grid-area: 2 / 2 / 3 / 4;
  border-bottom: 1px solid #ccd0d8;
}
.div5 {
  grid-area: 3 / 1 / 4 / 2;
  border-right: 1px solid #ccd0d8;
  border-bottom: 1px solid #ccd0d8;
}
.div6 {
  grid-area: 3 / 2 / 4 / 4;
  border-bottom: 1px solid #ccd0d8;
}
.div7 {
  grid-area: 4 / 1 / 5 / 2;
  border-right: 1px solid #ccd0d8;
}
.div8 {
  grid-area: 4 / 2 / 5 / 3;
  border-bottom: 1px solid #ccd0d8;
  border-right: 1px solid #ccd0d8;
}
.div9 {
  grid-area: 4 / 3 / 5 / 4;
  border-bottom: 1px solid #ccd0d8;
}

.grid-table-name {
  background-color: #edf2f7;
  font-weight: bold;
}
</style>