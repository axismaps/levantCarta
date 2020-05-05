<template>
  <div>
    <h2 style="margin-bottom: 20px">Change Sets</h2>
    <hr style="margin-bottom: 25px" />
    <div style="margin-bottom: 25px">
      <p>
        You’re viewing
        <el-select
          style="width: 190px"
          class="change-set-filter"
          v-model="filters.open"
          placeholder="Select"
          size="mini"
        >
          <el-option
            v-for="item in options.open"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>filtered by
        <el-select
          style="width: 130px"
          class="change-set-filter"
          v-model="filters.date"
          placeholder="Select"
          size="mini"
        >
          <el-option
            v-for="item in options.date"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>done by
        <el-select
          style="width: 100px"
          class="change-set-filter"
          v-model="filters.user"
          placeholder="Select"
          size="mini"
        >
          <el-option
            v-for="item in options.user"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </p>
    </div>
    <div>
      <el-card v-for="changeSet in changeSets" :key="changeSet.id" class="box-card" shadow="never">
        <div
          style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 7px;"
        >
          <div style="display: flex; align-items: center;">
            <font-awesome-icon :icon="['far', 'user-circle']" />
            <P style="margin-left: 5px">Submitted by {{changeSet.user}} on {{changeSet.date}}</P>
          </div>
          <admin-situational-menu
            controls="change-sets"
            @close-change-set="handleCloseChangeSet(changeSet.id)"
            @view-change-set="$router.push('/admin/change-sets/'+changeSet.id)"
          />
        </div>
        <div>
          <h4 style="margin-bottom: 10px">{{changeSet.title}}</h4>
          <p style="margin-bottom: 10px">{{changeSet.description}}</p>
          <p style="font-size=7px;">changes {{changeSet.changes.length}}</p>
        </div>
        <br />
      </el-card>
    </div>
  </div>
</template>

<script>
import AdminSituationalMenu from '~/components/AdminSituationalMenu';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    AdminSituationalMenu
  },
  data() {
    return {
      visibles: false,
      filters: { open: true, date: null, user: null },
      options: {
        open: [
          { value: true, label: 'Open Change Sets' },
          { value: false, label: 'Closed change sets' },
          { value: null, label: 'All Change Sets' }
        ],
        date: [
          { value: null, label: 'All Time' },
          { value: 7, label: 'Past Week' },
          { value: 30, label: 'Past 30 days' },
          { value: 60, label: 'Past 60 days' },
          { value: 90, label: 'Past 90 days' }
        ],
        user: [
          { value: null, label: 'All Users' },
          { value: 'Davi', label: 'Davi' },
          { value: 'Pedro', label: 'Pedro' }
        ]
      }
      // changeSetsData: [
      //   {
      //     id: 1,
      //     open: true,
      //     user: 'Davi',
      //     date: '05/20/2020',
      //     geometryType: 'roads',
      //     title: 'Edits to roads in the Ain El Mreiseh neighborhood',
      //     description:
      //       'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      //     changes: [1, 2, 3, 4, 5, 6]
      //   },
      //   {
      //     id: 2,
      //     open: false,
      //     user: 'Davi',
      //     date: '05/20/2020',
      //     geometryType: 'roads',
      //     title: 'Edits to roads in the Ain El Mreiseh neighborhood',
      //     description:
      //       'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      //     changes: [1, 2, 3, 4, 5, 6]
      //   },
      //   {
      //     id: 3,
      //     open: false,
      //     user: 'Pedro',
      //     date: '05/20/2020',
      //     geometryType: 'roads',
      //     title: 'Edits to roads in the Ain El Mreiseh neighborhood',
      //     description:
      //       'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      //     changes: [1, 2, 3, 4, 5, 6]
      //   }
      // ]
    };
  },
  computed: {
    ...mapGetters({
      changeSetsData: 'changeSets/changeSets'
    }),
    changeSets() {
      return this.changeSetsData; //TODO: Fix filter
      const { open, date, user } = this.filters;
      const data = this.changeSetsData;

      const byUser = data.filter(item => {
        if (!user) return true;
        return item.user === user;
      });

      const byOpen = byUser.filter(item => {
        if (!open) return true;
        return item.open === open;
      });

      return byOpen;
    }
  },
  methods: {
    ...mapActions({
      closeChangeSet: 'changeSets/closeChangeSet'
    }),
    async handleCloseChangeSet(changeSetId) {
      // console.log('close change set', changeSetId);
      this.closeChangeSet(changeSetId);
    }
  }
};
</script>

<style scoped>
</style>