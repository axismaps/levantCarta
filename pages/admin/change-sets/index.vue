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
          style="width: 100px"
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
        </el-select>and
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
      <!-- {{changeSets}} -->
      <el-card v-for="changeSet in changeSets" :key="changeSet.id" class="box-card" shadow="never">
        <div
          style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 7px;"
        >
          <div style="display: flex; align-items: center;">
            <font-awesome-icon :icon="['far', 'user-circle']" />
            <P style="margin-left: 5px">Submitted by {{changeSet.submitedBy}} on {{changeSet.date}}</P>
          </div>
          <div>
            <el-button class="font-awesome-icon" type="text" circle>
              <font-awesome-icon :icon="['far', 'ellipsis-h']" />
            </el-button>
          </div>
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
export default {
  data() {
    return {
      filters: { open: true, date: '05/20/2020', user: 'Davi' },
      options: {
        open: [
          { value: true, label: 'Open Change Sets' },
          { value: false, label: 'Closed change sets' }
        ],
        date: [{ value: 'All Time', label: 'All Time' }],
        user: [
          { value: 'Davi', label: 'Davi' },
          { value: 'Pedro', label: 'Pedro' }
        ]
      },
      changeSetsData: [
        {
          id: 1,
          open: true,
          submitedBy: 'Davi',
          date: '05/20/2020',
          geometryType: 'roads',
          title: 'Edits to roads in the Ain El Mreiseh neighborhood',
          description:
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
          changes: [1, 2, 3, 4, 5, 6]
        },
        {
          id: 2,
          open: false,
          submitedBy: 'Davi',
          date: '05/20/2020',
          geometryType: 'roads',
          title: 'Edits to roads in the Ain El Mreiseh neighborhood',
          description:
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
          changes: [1, 2, 3, 4, 5, 6]
        },
        {
          id: 3,
          open: false,
          submitedBy: 'Pedro',
          date: '05/20/2020',
          geometryType: 'roads',
          title: 'Edits to roads in the Ain El Mreiseh neighborhood',
          description:
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
          changes: [1, 2, 3, 4, 5, 6]
        }
      ]
    };
  },
  computed: {
    changeSets() {
      const { open, date, user } = this.filters;
      //   return { open, date, user };
      return this.changeSetsData.filter(changeSet => {
        return changeSet.submitedBy === user && changeSet.open === open;
      });
    }
  }
};
</script>

<style scoped>
</style>