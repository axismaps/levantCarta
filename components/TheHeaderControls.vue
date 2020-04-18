<template>
  <div class="container">
    <el-button class="font-awesome-icon" type="text" circle>
      <font-awesome-icon :icon="['far', 'cog']" />
    </el-button>

    <el-button class="font-awesome-icon" type="text" circle>
      <font-awesome-icon :icon="['far', 'bell']" />
    </el-button>

    <el-dropdown @command="handleCommand">
      <el-button class="font-awesome-icon" type="text" circle>
        <font-awesome-icon :icon="['far', 'user-circle']" />
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="logout">Logout</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  methods: {
    ...mapActions({
      logout: 'auth/logout'
    }),
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logout();
          break;

        default:
          break;
      }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
}
.el-dropdown {
  margin-left: 10px;
}
</style>