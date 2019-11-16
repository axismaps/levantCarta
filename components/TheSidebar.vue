<template>
  <div class="sidebar">
    <div v-if="drawMode === 'simple_select' && !selectedFeature">
      <div class="title">
        <el-input placeholder="Search..." v-model="searchbox" class="input-with-select"></el-input>
      </div>
      <div class="controls">
        <el-button
          type="success"
          icon="el-icon-plus"
          @click="addNewFeature"
        >{{$t('sidebar.newfeatureBtn')}}</el-button>
      </div>
    </div>

    <div v-else>
      <el-form :model="form" :rules="rules" ref="form" label-width="120px" label-position="top">
        <el-form-item :label="$t('sidebar.name')" prop="name">
          <div class="form-input-with-ctrl-btn">
            <el-input v-model="form.name" @change="handleUpdateAttributeForm"></el-input>
            <el-button
              id="name"
              icon="el-icon-refresh-left"
              type="info"
              @click="undoAttributeFormChange"
              :disabled="!hasChanged.name"
              plain
            ></el-button>
          </div>
        </el-form-item>

        <el-form-item :label="$t('sidebar.mapped')" required>
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item prop="mappedFrom">
                <div class="form-input-with-ctrl-btn">
                  <el-date-picker
                    id="year-stepper"
                    v-model="form.mappedFrom"
                    @change="handleUpdateAttributeForm"
                    type="year"
                    format="yyyy"
                    value-format="yyyy"
                    placeholder="Pick a year"
                  ></el-date-picker>
                  <el-button
                    id="mappedFrom"
                    icon="el-icon-refresh-left"
                    type="info"
                    :disabled="!hasChanged.mappedFrom"
                    @click="undoAttributeFormChange"
                    plain
                  ></el-button>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="2">to</el-col>
            <el-col :span="11">
              <el-form-item prop="mappedTo">
                <div class="form-input-with-ctrl-btn">
                  <el-date-picker
                    id="year-stepper"
                    v-model="form.mappedTo"
                    @change="handleUpdateAttributeForm"
                    type="year"
                    format="yyyy"
                    value-format="yyyy"
                    placeholder="Pick a year"
                  ></el-date-picker>
                  <el-button
                    id="mappedTo"
                    icon="el-icon-refresh-left"
                    type="info"
                    :disabled="!hasChanged.mappedTo"
                    @click="undoAttributeFormChange"
                    plain
                  ></el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item :label="$t('sidebar.type')" prop="type">
          <div class="form-input-with-ctrl-btn">
            <el-select v-model="form.type" @change="handleUpdateAttributeForm" placeholder="Type">
              <el-option
                v-for="type in currentLayer.layerTypes"
                :key="type"
                :label="type"
                :value="type"
              ></el-option>
            </el-select>
            <el-button
              id="type"
              icon="el-icon-refresh-left"
              type="info"
              :disabled="!hasChanged.type"
              @click="undoAttributeFormChange"
              plain
            ></el-button>
          </div>
        </el-form-item>
        <the-sidebar-add-tag :initialTags="form.tags" @update-tags="handleUpdateTags" />
      </el-form>
      <pre>{{selectedFeature}}</pre>
      <!-- <h5>{{$t('hello')}}</h5> -->
      <!-- <p>
        Is form valid:
        <br />
        {{isAttributeFormValid}}
      </p>
      <p>
        Is edition in progress:
        <br />
        {{isEditionInProgress}}
      </p>-->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import TheSidebarAddTag from '~/components/TheSidebarAddTag';
export default {
  components: {
    TheSidebarAddTag
  },
  data() {
    const checkYearRange = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password again'));
      } else if (value <= this.form.mappedFrom) {
        callback(new Error('It must be after Start Year'));
      } else {
        callback();
      }
    };
    return {
      searchbox: '',
      form: {
        name: '',
        mappedFrom: '',
        mappedTo: '',
        type: '',
        tags: []
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Please input Feature name',
            trigger: 'blur'
          }
        ],
        mappedFrom: [
          {
            type: 'string',
            required: true,
            message: 'Please a select a Year',
            trigger: 'change'
          }
        ],
        mappedTo: [
          {
            type: 'string',
            required: true,
            message: 'Please a select a Year',
            trigger: 'change'
          },
          { validator: checkYearRange, trigger: 'change' }
        ],
        type: [
          {
            type: 'string',
            required: true,
            message: 'Please select the Feature type',
            trigger: 'change'
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters({
      drawMode: 'drawMode',
      selectedFeature: 'selectedFeature',
      currentLayer: 'layers/currentItem',
      isAttributeFormValid: 'isAttributeFormValid',
      isEditionInProgress: 'isEditionInProgress'
    }),
    hasChanged() {
      if (!this.selectedFeature)
        return {
          name: false,
          mappedFrom: false,
          mappedTo: false,
          type: false
        };
      return {
        name: !(this.form.name === this.selectedFeature.properties.name),
        mappedFrom: !(
          this.form.mappedFrom === this.selectedFeature.properties.mappedFrom
        ),
        mappedTo: !(
          this.form.mappedTo === this.selectedFeature.properties.mappedTo
        ),
        type: !(this.form.type === this.selectedFeature.properties.type)
      };
    }
  },
  methods: {
    ...mapActions({
      updateAttributeForm: 'updateAttributeForm',
      updateAttributeFormValidity: 'updateAttributeFormValidity'
    }),
    addNewFeature() {
      this.$emit('add-new-feature');
    },
    handleUpdateAttributeForm() {
      this.updateAttributeForm(JSON.parse(JSON.stringify(this.form))); //  I'm doing a deep copy here...

      this.$refs['form'].validate(valid => {
        if (valid) {
          this.updateAttributeFormValidity(true);
        } else {
          this.updateAttributeFormValidity(false);
          return false;
        }
      });
    },
    handleUpdateTags(tags) {
      this.form.tags = tags;
      this.handleUpdateAttributeForm();
    },
    undoAttributeFormChange(event) {
      const eventSource = event.currentTarget.id;
      this.form[eventSource] = this.selectedFeature.properties[eventSource];
      this.handleUpdateAttributeForm();
    }
    //TODO: implementar lógica para controlar o btn se nada tiver mudado
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'UPDATE_SELECTED_FEATURE') {
        if (state.selectedFeature) {
          this.form = JSON.parse(
            JSON.stringify(state.selectedFeature.properties) //I'm doing a deep copy here...
          );
        } else {
          this.form = {
            name: '',
            mappedFrom: '',
            mappedTo: '',
            type: '',
            tags: []
          };
        }
      }
    });
  }
};
</script>

<style  lang="scss" scoped>
.sidebar {
  min-width: $sidebar-width;
  max-height: calc(100vh - #{$header-height});
  background-color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 1px 3px rgb(206, 206, 206);
  overflow-y: auto;
  padding: 20px;
}
.title {
  position: relative;
  text-align: center;
  width: 100%;
  background-color: #edf2f7;
  .close {
    position: absolute;
    top: 26px;
    right: 14px;
    cursor: pointer;
  }
}
.el-date-editor.el-input {
  width: 130px;
}
.controls {
  padding: 20px 0px;
  text-align: start;
  .el-button {
    width: 100%;
    height: 56px;
  }
  .control {
    padding-bottom: 20px;
    .el-input {
      padding-top: 5px;
    }
  }
}
</style>