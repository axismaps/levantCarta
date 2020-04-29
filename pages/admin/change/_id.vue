<template>
  <div>
    <div style="margin-bottom: 20px;">
      <admin-control-menu @back="$router.push(`/admin/change-sets/1`)" />
    </div>
    <h2 style="margin: 14px 0px">{{change.originalFeature.properties.name}}</h2>
    <p style="margin: 14px 0px">Submitted by {{change.submittedBy}} on {{change.createAt}}</p>
    <div style="display: flex; margin: 14px 0px">
      <div style="display: flex; align-items: center;">
        <font-awesome-icon :icon="['far', 'layer-group']" />
        <p style="margin-left: 5px">{{change.layer}}</p>
      </div>
      <div style="display: flex; align-items: center; margin-left: 10px;">
        <font-awesome-icon :icon="['far', 'pencil']" />
        <p style="margin-left: 5px">{{change.editType}}</p>
      </div>
      <div style="display: flex; align-items: center; margin-left: 10px; color: #25993E ">
        <font-awesome-icon :icon="['far', 'battery-full']" />
        <p style="margin-left: 5px">{{change.approvedStatus? 'Approved': 'Open'}}</p>
      </div>
    </div>
    <hr style="margin: 20px 0px" />
    <div style="display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 28px">
      <div>
        <h3 style="margin: 14px 0px">Geography</h3>
        <div style="display:flex;">
          <div style="display: flex; align-items: center; ">
            <font-awesome-icon style="color: #E35A5A" :icon="['fas', 'circle']" />
            <p style="margin-left: 5px">Deleted</p>
          </div>
          <div style="display: flex; align-items: center; ">
            <font-awesome-icon style="color: #5A6FE3" :icon="['fas', 'circle']" />
            <p style="margin-left: 5px">Original</p>
          </div>
          <div style="display: flex; align-items: center; ">
            <font-awesome-icon style="color: #2DB84B" :icon="['fas', 'circle']" />
            <p style="margin-left: 5px">Edited</p>
          </div>
          <div style="display: flex; align-items: center; ">
            <font-awesome-icon style="color: #CCCCCC" :icon="['fas', 'circle']" />
            <p style="margin-left: 5px">Unchanged</p>
          </div>
        </div>
      </div>
      <div>
        <h3 style="margin: 14px 0px">Atributes</h3>
        <div style="display:flex">
          <div style="display: flex; align-items: center; ">
            <font-awesome-icon style="color: #E35A5A" :icon="['fas', 'circle']" />
            <p style="margin-left: 5px">Deleted</p>
          </div>
          <div style="display: flex; align-items: center; ">
            <font-awesome-icon style="color: #5A6FE3" :icon="['fas', 'circle']" />
            <p style="margin-left: 5px">Original</p>
          </div>
          <div style="display: flex; align-items: center; ">
            <font-awesome-icon style="color: #2DB84B" :icon="['fas', 'circle']" />
            <p style="margin-left: 5px">Edited</p>
          </div>
          <div style="display: flex; align-items: center; ">
            <font-awesome-icon style="color: #CCCCCC" :icon="['fas', 'circle']" />
            <p style="margin-left: 5px">Unchanged</p>
          </div>
        </div>

        <div style="margin: 14px 0px" class="atributes-table">
          <div class="div1 grid-table-name">From</div>
          <div class="div2">1920</div>
          <div class="div3 grid-table-name">To</div>
          <div class="div4">2019</div>
          <div class="div5 grid-table-name">Type</div>
          <div class="div6">Secondary</div>
          <div class="div7 grid-table-name">Tags</div>
          <div class="div8 grid-table-name">Name</div>
          <div class="div9 grid-table-name">Value</div>
          <div class="div10">Surface</div>
          <div class="div11">Paved</div>
          <div class="div12">Use</div>
          <div class="div13">Construction</div>
        </div>
      </div>
    </div>
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
          <font-awesome-icon style="font-size: 16px" :icon="['far', 'user-circle']" />
          <p style="margin-left: 5px">Username</p>
          <p style="margin-left: 5px; color: #A0AEC0;">12/04/20</p>
        </div>
        <div style="margin-left: 21px">
          <p
            style="padding: 10px; border-radius: 4px; background-color: #EDF2F7; "
          >Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna.</p>
          <div style="display: flex; align-items: center;">
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
export default {
  components: {
    AdminControlMenu
  },
  data() {
    return {
      comments: ''
    };
  },
  async fetch({ store, params }) {
    await store.dispatch('changeSets/setChangeById', params.id);
  },
  computed: {
    ...mapGetters({
      change: 'changeSets/change'
    })
  }
};
</script>

<style scoped>
.atributes-table {
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  grid-template-rows: repeat(6, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid #ccd0d8;
}

.atributes-table div {
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
  grid-area: 4 / 1 / 7 / 2;
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
.div10 {
  grid-area: 5 / 2 / 6 / 3;
  border-bottom: 1px solid #ccd0d8;
  border-right: 1px solid #ccd0d8;
}
.div11 {
  grid-area: 5 / 3 / 6 / 4;
  border-bottom: 1px solid #ccd0d8;
}
.div12 {
  border-right: 1px solid #ccd0d8;
  grid-area: 6 / 2 / 7 / 3;
}
.div13 {
  grid-area: 6 / 3 / 7 / 4;
}

.grid-table-name {
  background-color: #edf2f7;
  font-weight: bold;
}
</style>