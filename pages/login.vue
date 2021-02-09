<template>
  <div class="container">
    <el-card class="box-card">
      <div class="login-header">
        <h1>Welcome</h1>
      </div>
      <el-form
        label-position="top"
        :rules="rules"
        label-width="10px"
        ref="form"
        :model="form"
      >
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" type="email" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item class="el-form-btn">
          <el-button
            type="primary"
            :loading="loggingIn"
            @click="submitForm('form')"
            >Login</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
      form: {
        email: 'admin@leventcarta.org',
        password: 'admin',
      },
      rules: {
        email: [
          {
            required: true,
            message: 'Please input email address',
            trigger: 'blur',
          },
          {
            type: 'email',
            message: 'Please input correct email address',
            trigger: ['blur', 'change'],
          },
        ],
        password: [
          {
            required: true,
            message: 'Please input password',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters({ user: 'auth/user', loggingIn: 'auth/loggingIn' }),
  },

  methods: {
    ...mapActions({ login: 'auth/login', logout: 'auth/logout' }),
    submitForm(formName) {
      const { email, password } = this.form;
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            this.login({ username: email, password });
          } catch (error) {}
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.container {
  background-color: #edf2f7;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 380px;
  padding: 20px;
}
.el-form-btn {
  margin-top: 42px;
  display: flex;
  justify-content: center;
}
.el-button {
  background-color: #4299e1;
}
.login-header {
  display: flex;
  justify-content: center;
  margin-top: 42px;
  margin-bottom: 62px;
  color: #2d3748;
}
</style>