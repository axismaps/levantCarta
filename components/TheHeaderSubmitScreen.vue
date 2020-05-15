<template>
  <div>
    <el-popover v-if="hasUnsubmittedChanges" placement="bottom" width="310" trigger="click">
      <div>
        <el-form :model="form" :rules="rules" ref="form" label-width="220px" label-position="top">
          <el-form-item label="Title" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="Brief description of changes" prop="description">
            <el-input type="textarea" v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="success"
              @click="submitForm('form')"
              :loading="isLoading"
            >Submit Changes</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button
        slot="reference"
        type="success"
        icon="el-icon-check"
      >Submit ({{unsubmittedChanges.length}})</el-button>
    </el-popover>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

//TODO: adicionar um estado de loading, confirmação de envio e desabilitar o botão de envio se a form nao for valida
export default {
  data() {
    return {
      form: {
        title: '',
        description: ''
      },
      rules: {
        title: [
          {
            required: true,
            message: 'Please input Activity title',
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: true,
            message: 'Please input Activity description',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters({
      unsubmittedChanges: 'changes/unsubmittedChanges',
      hasUnsubmittedChanges: 'changes/hasUnsubmittedChanges',
      isLoading: 'changeSets/isLoading'
    })
  },
  methods: {
    ...mapActions({
      submitNewChangeSet: 'changeSets/submitNewChangeSet'
    }),
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const changeSet = {
            title: this.form.title,
            description: this.form.description,
            changes: this.unsubmittedChanges
          };
          this.submitNewChangeSet(changeSet);
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
</style>