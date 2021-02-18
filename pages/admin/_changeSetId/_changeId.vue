<template>
  <div>
    <!-- <pre>{{ change }}</pre> -->
    <div style="margin-bottom: 20px">
      <admin-control-menu
        :isSingleChangeView="true"
        :isLoading="isLoading"
        @approve-change="handleApproveChange"
        @revert-change="handleRevertChange"
        @edit-change="handleEditChange"
        @back="$router.push(`/admin/change-sets/`)"
      />
    </div>
    <h2 style="margin: 14px 0px">{{ change.newFeature.properties.name }}</h2>
    <p style="margin: 14px 0px">Submitted by {{ change.user.name }}</p>
    <div style="display: flex; margin: 14px 0px">
      <div style="display: flex; align-items: center">
        <font-awesome-icon :icon="['far', 'layer-group']" />
        <p style="margin-left: 5px">{{ change.newFeature.layerName }}</p>
      </div>
      <div style="display: flex; align-items: center; margin-left: 10px">
        <font-awesome-icon :icon="['far', 'pencil']" />
        <p style="margin-left: 5px; text-transform: capitalize">
          {{ change.editType }}
        </p>
      </div>
      <div
        style="
          display: flex;
          align-items: center;
          margin-left: 10px;
          color: #25993e;
        "
      >
        <font-awesome-icon :icon="['far', 'battery-full']" />
        <p style="margin-left: 5px">
          {{ change.approvedStatus ? 'Approved' : 'Open' }}
        </p>
      </div>
    </div>
    <hr style="margin: 20px 0px" />
    <!-- <admin-change-diff
      :editType="change.editType"
      :originalFeature="change.originalFeature"
      :newFeature="change.newFeature"
    /> -->
    <div>
      <el-input
        style="margin-bottom: 28px"
        placeholder="Add a comment"
        suffix-icon="el-icon-chat-round"
        v-model="comments"
      ></el-input>
      <h4 style="margin: 14px 0px">Comments</h4>
      <div>
        <div style="display: flex; align-items: center; margin: 14px 0px">
          <font-awesome-icon
            style="font-size: 16px"
            :icon="['far', 'user-circle']"
          />
          <p style="margin-left: 5px">Username</p>
          <p style="margin-left: 5px; color: #a0aec0">12/04/20</p>
        </div>
        <div style="margin-left: 21px">
          <p
            style="padding: 10px; border-radius: 4px; background-color: #edf2f7"
          >
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna.
          </p>
          <div style="display: flex; align-items: center">
            <el-button type="text">Reply</el-button>
            <el-button type="text">Resolve</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AdminControlMenu from '@/components/AdminControlMenu.vue';
import AdminChangeDiff from '@/components/AdminChangeDiff.vue';

export default {
  components: {
    AdminChangeDiff,
    AdminControlMenu,
  },
  data() {
    return {
      comments: '',
    };
  },
  async fetch({ store, params }) {
    await store.dispatch('changeSets/setChangeById', params.changeId);
  },
  computed: {
    ...mapGetters({
      change: 'changeSets/change',
      isLoading: 'changeSets/isLoading',
    }),
  },
  methods: {
    ...mapActions({
      approveChangeById: 'changeSets/approveChangeById',
      revertChangeById: 'changeSets/revertChangeById',
    }),
    async handleApproveChange() {
      const { changeSetId, changeId } = this.$route.params;
      try {
        await this.approveChangeById({
          changeId: changeId,
          changeSetId: changeSetId,
        });
        this.$router.push({
          path: `/admin/change-sets/${changeSetId}`,
        });
      } catch (error) {}
    },
    async handleRevertChange() {
      const { changeSetId, changeId } = this.$route.params;
      try {
        await this.revertChangeById({
          changeId: changeId,
          changeSetId: changeSetId,
        });
        this.$router.push({
          path: `/admin/change-sets/${changeSetId}`,
        });
      } catch (error) {}
    },
    handleEditChange() {},
  },
};
</script>

<style scoped>
</style>