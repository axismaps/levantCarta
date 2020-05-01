<template>
  <div>
    <admin-header />
    <el-row type="flex" justify="center">
      <el-col :span="15">
        <nuxt-child />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import AdminHeader from '@/components/AdminHeader';
export default {
  components: {
    AdminHeader
  },
  created() {
    this.$store.dispatch('changeSets/setAllChangeSets');
  }
};
</script>

<style scoped>
.el-row {
  padding-top: 100px;
}
</style>