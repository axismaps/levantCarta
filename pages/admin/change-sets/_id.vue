<template>
  <div>
    <admin-control-menu />
    <br />
    <h4>Edits to {{changeSet.type}} in the {{changeSet.area}}</h4>
    <p>Submitted by {{changeSet.user}} on {{changeSet.date}}</p>
    <br />
    <hr />

    <el-table
      :data="changeSet.changes"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="date" label="Date" width="95"></el-table-column>
      <el-table-column prop="layer" label="Layer"></el-table-column>
      <el-table-column prop="feature" label="Feature" width="180"></el-table-column>
      <el-table-column prop="from" label="From"></el-table-column>
      <el-table-column prop="to" label="To"></el-table-column>
      <el-table-column prop="type" label="Type"></el-table-column>
      <el-table-column prop="status" label="Status"></el-table-column>
      <el-table-column prop="edit" label="Edit"></el-table-column>
      <el-table-column width="120">
        <template slot-scope="scope">
          <AdminSituationalMenu
            @view-feature="handleViewFeature(scope.$index, changeSet.changes)"
            @approve-change="handleApproveChange(scope.$index)"
            @revert-change="handleRevertChange(scope.$index)"
            @edit-feature="handleEditFeature(scope.$index)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import AdminControlMenu from '@/components/AdminControlMenu';
import AdminSituationalMenu from '@/components/AdminSituationalMenu';
export default {
  components: {
    AdminControlMenu,
    AdminSituationalMenu
  },
  data() {
    return {
      changeSet: {
        type: 'roads',
        area: 'Ain El Mreiseh neighborhood',
        user: 'Davi',
        date: '05/20/2020',
        changes: [
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
      }
    };
  },
  methods: {
    handleViewFeature(index, tableData) {
      console.log('view feature', index, tableData);
    },
    handleApproveChange(index) {
      console.log('approve-change', index);
    },
    handleRevertChange(index) {
      console.log('revert-change', index);
    },
    handleEditFeature(index) {
      console.log('edit-feature', index);
    },
    handleSelectionChange() {
      console.log('selection change');
    }
  }
};
</script>

<style scoped>
</style>
