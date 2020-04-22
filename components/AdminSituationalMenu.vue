<template>
  <div>
    <el-popover placement="bottom" width="160" v-model="visible">
      <div style=" margin: 0">
        <div>
          <el-button
            @click="$emit('view-change-set')"
            slot="reference"
            class="font-awesome-icon"
            type="text"
          >
            <div style="display: flex; align-items: center;">
              <font-awesome-icon :icon="['far', 'binoculars']" />
              <p style="font-size: 14px; margin-left: 5px">View Change Set</p>
            </div>
          </el-button>
        </div>
        <div>
          <el-button
            @click="$emit('close-change-set')"
            slot="reference"
            class="font-awesome-icon"
            type="text"
          >
            <div style="display: flex; align-items: center;">
              <font-awesome-icon :icon="['far', 'check']" />
              <p style="font-size: 14px; margin-left: 5px">Close Change Set</p>
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
  data() {
    return {
      visible: false
    };
  }
};
</script>

<style scoped>
</style>