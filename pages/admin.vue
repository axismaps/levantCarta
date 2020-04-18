<template>
  <div>
    <admin-header />
    <el-row type="flex" justify="center">
      <el-col :span="14">
        <nuxt-child />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import AdminHeader from '@/components/AdminHeader';
export default {
  components: {
    AdminHeader
  }
};
</script>

<style scoped>
.el-row {
  padding-top: 42px;
}
</style>