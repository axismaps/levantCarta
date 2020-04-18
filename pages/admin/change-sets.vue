<template>
  <div>
    <admin-control-menu />
    <br />
    <h4>Edits to {{type}} in the {{area}}</h4>
    <p>Submitted by {{user}} on {{date}}</p>
    <br />
    <hr />

    <el-table :data="changeSets" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="date" label="Date" width="95"></el-table-column>
      <el-table-column prop="layer" label="Layer"></el-table-column>
      <el-table-column prop="feature" label="Feature" width="180"></el-table-column>
      <el-table-column prop="from" label="From"></el-table-column>
      <el-table-column prop="to" label="To"></el-table-column>
      <el-table-column prop="type" label="Type"></el-table-column>
      <el-table-column prop="status" label="Status"></el-table-column>
      <el-table-column prop="edit" label="Edit"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import AdminControlMenu from '@/components/AdminControlMenu';
export default {
  components: {
    AdminControlMenu
  },
  data() {
    return {
      changeSets: [
        {
          date: '2016-05-03',
          layer: 'Roads',
          feature: 'No. 189, Grove St, Los Angeles',
          from: '1915',
          to: '2019',
          type: 'Secondary',
          status: 'Open',
          edit: 'Create'
        },
        {
          date: '2016-05-03',
          layer: 'Roads',
          feature: 'No. 189, Grove St, Los Angeles',
          from: '1915',
          to: '2019',
          type: 'Secondary',
          status: 'Open',
          edit: 'Create'
        }
      ]
    };
  }
};
</script>

<style scoped>
hr {
  border: 0;
  height: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 15px;
}
</style>
