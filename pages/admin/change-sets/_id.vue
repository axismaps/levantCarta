<template>
  <div>
    <admin-control-menu
      :hasSelections="multipleSelection.length > 0"
      @approve-selected="handleApproveSelected"
      @revert-selected="handleRevertSelected"
      @close-change-set="handleCloseChangeSet"
      @back="$router.push('/admin/change-sets/')"
    />
    <br />
    <h4>Edits to {{changeSet.type}} in the {{changeSet.title}}</h4>
    <p>Submitted by {{changeSet.user}} on {{changeSet.createAt}}</p>
    <br />
    <hr />

    <el-table
      :data="changeSet.changes"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="createAt" label="Date" width="95" sortable></el-table-column>
      <el-table-column prop="layer" label="Layer"></el-table-column>
      <el-table-column prop="originalFeature.properties.name" label="Feature" width="180"></el-table-column>
      <el-table-column prop="originalFeature.properties.from" label="From"></el-table-column>
      <el-table-column prop="originalFeature.properties.to" label="To"></el-table-column>
      <el-table-column prop="originalFeature.properties.type" label="Type" width="85"></el-table-column>
      <el-table-column prop="approvedStatus" label="Status" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.approvedStatus">Approved</span>
          <span v-else style="color: #25993E">Open</span>
        </template>
      </el-table-column>
      <el-table-column prop="editType" label="Edit"></el-table-column>
      <el-table-column width="120">
        <template slot-scope="scope">
          <AdminSituationalMenu
            @view-feature="handleViewFeature(scope.$index, changeSet.changes)"
            @approve-change="handleApproveChange(scope.$index,changeSet.changes)"
            @revert-change="handleRevertChange(scope.$index,changeSet.changes)"
            @edit-feature="handleEditFeature(scope.$index,changeSet.changes)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AdminControlMenu from '@/components/AdminControlMenu';
import AdminSituationalMenu from '@/components/AdminSituationalMenu';

export default {
  components: {
    AdminControlMenu,
    AdminSituationalMenu
  },
  data() {
    return {
      multipleSelection: []
    };
  },
  async fetch({ store, params }) {
    await store.dispatch('changeSets/setChangeSetById', params.id);
  },
  computed: {
    ...mapGetters({
      changeSet: 'changeSets/changeSet'
    })
  },
  methods: {
    ...mapActions({
      closeChangeSet: 'changeSets/closeChangeSet',
      approveChange: '_changes/approveChange',
      revertChange: '_changes/revertChange',
      bulkApproveChanges: '_changes/bulkApproveChanges',
      bulkRevertChanges: '_changes/bulkRevertChanges'
    }),

    handleCloseChangeSet() {
      this.closeChangeSet(this.changeSet.id);
    },
    handleViewFeature(index, tableData) {
      this.$router.push({ path: `/admin/change/${tableData[index].id}` });
    },
    handleApproveChange(index, tableData) {
      this.approveChange(tableData[index].id);
    },
    handleRevertChange(index, tableData) {
      this.revertChange(tableData[index].id);
    },
    handleEditFeature(index) {
      console.log('edit-feature', index);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleRevertSelected() {
      const changes = this.multipleSelection;
      this.bulkApproveChanges(changes);
    },
    handleApproveSelected() {
      const changes = this.multipleSelection;
      this.bulkRevertChanges(changes);
    }
  }
};
</script>

<style scoped>
</style>
