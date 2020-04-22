<template>
  <div>
    <el-popover placement="bottom" width="160" v-model="visible">
      <div style=" margin: 0">
        <div v-for="option in options" :key="option.id">
          <el-button
            @click="$emit(option.action)"
            slot="reference"
            class="font-awesome-icon"
            type="text"
          >
            <div style="display: flex; align-items: center;">
              <font-awesome-icon :icon="['far', option.icon]" />
              <p style="font-size: 14px; margin-left: 5px">{{option.name}}</p>
            </div>
          </el-button>
        </div>
      </div>
      <el-button style="padding: 0px" slot="reference" class="font-awesome-icon" type="text">
        <font-awesome-icon :icon="['far', 'ellipsis-h']" />
      </el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  props: {
    controls: {
      type: String
    }
  },
  data() {
    return {
      controlOptions: [
        {
          id: 1,
          name: 'View Change Set',
          icon: 'binoculars',
          action: 'view-change-set'
        },
        {
          id: 2,
          name: 'Close Change Set',
          icon: 'check',
          action: 'close-change-set'
        },
        {
          id: 3,
          name: 'View Feature',
          icon: 'binoculars',
          action: 'view-feature'
        },
        {
          id: 4,
          name: 'Approve',
          icon: 'check',
          action: 'approve-change'
        },
        {
          id: 5,
          name: 'Revert',
          icon: 'undo',
          action: 'revert-change'
        },
        {
          id: 6,
          name: 'Edit',
          icon: 'edit',
          action: 'edit-feature'
        }
      ],

      visible: false
    };
  },
  computed: {
    options() {
      if (this.controls === 'change-sets') {
        return this.controlOptions.slice(0, 2);
      } else {
        return this.controlOptions.slice(2);
      }
    }
  }
};
</script>

<style scoped>
</style>