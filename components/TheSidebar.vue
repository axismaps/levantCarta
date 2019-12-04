<template>
  <div class="sidebar">
    <div v-if="drawMode === 'simple_select' && !selectedFeature">
      <div class="title">
        <div class="form-input-with-ctrl-btn">
          <el-input placeholder="Search..." v-model="searchbox" class="input-with-select"></el-input>
          <el-button icon="el-icon-search" type="info" plain></el-button>
        </div>
      </div>
      <div class="controls">
        <el-button
          type="success"
          icon="el-icon-plus"
          @click="addNewFeature"
          :disabled="!currentLayer"
        >{{$t('sidebar.newfeatureBtn')}}</el-button>
      </div>
    </div>

    <div v-else>
      <el-row type="flex" justify="end">
        <el-col :span="2" :offset="22" style="text-align: end">
          <i id="close-edition" class="el-icon-close close-btn" @click="handleCloseEdition"></i>
        </el-col>
      </el-row>
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
            <el-col :span="12">
              <el-form-item label="From" prop="firstyear">
                <div class="form-input-with-ctrl-btn">
                  <el-input-number
                    v-model="form.firstyear"
                    @change="handleUpdateAttributeForm"
                    :controls="false"
                  ></el-input-number>
                  <el-button
                    id="firstyear"
                    icon="el-icon-refresh-left"
                    type="info"
                    :disabled="!hasChanged.firstyear"
                    @click="undoAttributeFormChange"
                    plain
                  ></el-button>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="To" prop="lastyear">
                <div class="form-input-with-ctrl-btn">
                  <el-input-number
                    v-model="form.lastyear"
                    @change="handleUpdateAttributeForm"
                    :controls="false"
                  ></el-input-number>
                  <el-button
                    id="lastyear"
                    icon="el-icon-refresh-left"
                    type="info"
                    :disabled="!hasChanged.lastyear"
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
                v-for="type in currentLayer.Types"
                :key="type.id"
                :label="type.title"
                :value="type.id"
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
      if (value <= this.form.firstyear) {
        callback(new Error(this.$t('erros.invalidYearDate')));
      } else {
        callback();
      }
    };
    return {
      searchbox: '',
      form: {
        name: '',
        firstyear: '',
        lastyear: '',
        type: '',
        tags: ''
      },
      rules: {
        firstyear: [
          {
            type: 'number',
            required: true,
            message: this.$t('erros.selectYear'),
            trigger: 'change'
          }
        ],
        lastyear: [
          {
            type: 'number',
            required: true,
            message: this.$t('erros.selectYear'),
            trigger: 'change'
          },
          { validator: checkYearRange, trigger: 'change' }
        ],
        type: [
          {
            type: 'string',
            required: true,
            message: this.$t('erros.selectType'),
            trigger: 'change'
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters({
      draw: 'draw',
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
          firstyear: false,
          lastyear: false,
          type: false
        };
      return {
        name: !(this.form.name === this.selectedFeature.properties.name),
        firstyear: !(
          this.form.firstyear === this.selectedFeature.properties.firstyear
        ),
        lastyear: !(
          this.form.lastyear === this.selectedFeature.properties.lastyear
        ),
        type: !(this.form.type === this.selectedFeature.properties.type)
      };
    }
  },
  methods: {
    ...mapActions({
      updateAttributeForm: 'updateAttributeForm',
      updateAttributeFormValidity: 'updateAttributeFormValidity',
      updateSelectedFeature: 'updateSelectedFeature',
      updateDrawMode: 'updateDrawMode'
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
    },
    handleCloseEdition() {
      this.updateSelectedFeature([]);
      this.draw.changeMode('simple_select');
      this.updateDrawMode('simple_select');
    }
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
            firstyear: '',
            lastyear: '',
            type: '',
            tags: ''
          };
        }
      }
    });
  }
};
</script>

<style lang="scss" scoped>
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
.close-btn {
  color: grey;
  text-align: end;
  cursor: pointer;
  &:hover {
    color: $--color-primary;
  }
}
</style>