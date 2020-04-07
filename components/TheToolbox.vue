<template>
  <div>
    <div id="toggle-sidebar-control" class="el-button-group btn-group">
      <el-tooltip
        v-if="isSidebarOpen"
        class="item"
        effect="dark"
        content="Close sidebar"
        placement="right"
      >
        <el-button @click="toggleSidebar">
          <collapse-left-icon viewBox="0 0 22 22" class="img-responsive" />
        </el-button>
      </el-tooltip>
      <el-tooltip v-else class="item" effect="dark" content="Open sidebar" placement="right">
        <el-button size="small" @click="toggleSidebar">
          <collapse-rigth-icon viewBox="0 0 22 22" class="img-responsive" />
        </el-button>
      </el-tooltip>
    </div>

    <div id="draw-feature-control" class="el-button-group btn-group">
      <el-tooltip class="item" effect="dark" content="Draw point feature" placement="right">
        <el-button
          id="add-point-btn"
          :class="{ active: isDrawToolActive }"
          @click="addNewFeature"
          v-if="activeLayer && activeLayer.geometry == 'point'"
          :disabled="!shouldDrawToolBeAnable"
        >
          <point-icon viewBox="0 0 22 22" class="img-responsive" />
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="Draw line feature" placement="right">
        <el-button
          id="add-line-btn"
          :class="{ active: isDrawToolActive }"
          @click="addNewFeature"
          v-if="activeLayer && activeLayer.geometry == 'line'"
          :disabled="!shouldDrawToolBeAnable"
        >
          <line-icon viewBox="0 0 22 22" class="img-responsive" />
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="Draw polygon feature" placement="right">
        <el-button
          id="add-polygon-btn"
          :class="{ active: isDrawToolActive }"
          @click="addNewFeature"
          v-if="activeLayer && activeLayer.geometry == 'polygon'"
          :disabled="!shouldDrawToolBeAnable"
        >
          <polygon-icon viewBox="0 0 22 22" class="img-responsive" />
        </el-button>
      </el-tooltip>

      <el-tooltip class="item" effect="dark" content="Add geometry to feature" placement="right">
        <el-button
          id="add-geo-btn"
          :class="{ active: isAddSliplitMultipartToolActive }"
          @click="addGeometry"
          :disabled="!shouldAddSplitMultipartFeatureBeAnable"
        >
          <add-geo-icon viewBox="0 0 22 22" class="img-responsive" />
        </el-button>
      </el-tooltip>

      <el-button id="sub-geo-btn" @click="subtractGeometry" :disabled="isDrawToolActive">
        <sub-geo-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>
      <el-tooltip class="item" effect="dark" content="Toggle snap" placement="right">
        <el-button
          id="snap-btn"
          :class="{ 'active-toggle': isSnapActive }"
          @click="toggleSnap"
          :disabled="isDrawToolActive"
        >
          <snap-icon viewBox="0 0 22 22" class="img-responsive" />
        </el-button>
      </el-tooltip>
    </div>

    <div id="splip/merge-controls" class="el-button-group btn-group">
      <el-tooltip class="item" effect="dark" content="Merge selected features" placement="right">
        <el-button id="merge-btn" @click="mergeSelectedFeatures" :disabled="!isMultiselect">
          <compress-icon viewBox="0 0 22 22" class="img-responsive" />
        </el-button>
      </el-tooltip>

      <el-tooltip class="item" effect="dark" content="Split multipart feature" placement="right">
        <el-button
          id="split-btn"
          @click="splitMultfeature"
          :disabled="!shouldAddSplitMultipartFeatureBeAnable"
        >
          <expand-icon viewBox="0 0 22 22" class="img-responsive" />
        </el-button>
      </el-tooltip>
    </div>

    <div id="clone-control" class="el-button-group btn-group">
      <el-tooltip class="item" effect="dark" content="Clone selected feature" placement="right">
        <el-button id="clone-btn" @click="cloneFeature" :disabled="!shouldCloneFeatureBeAnable">
          <clone-icon viewBox="0 0 22 22" class="img-responsive" />
        </el-button>
      </el-tooltip>
    </div>

    <div id="undo/delete-control" class="el-button-group btn-group">
      <el-button slot="reference" size="mini" @click="undoDrawAction" icon="el-icon-refresh-left" />

      <el-popover placement="right" width="190" v-model="confirmDeleteVisibily">
        <p>
          Are you sure to delete
          <br />this feature?
        </p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="confirmDeleteVisibily = false">cancel</el-button>
          <el-button type="primary" size="mini" @click="trash">confirm</el-button>
        </div>
        <el-button slot="reference" size="mini" icon="el-icon-delete" :disabled="!selectedFeature" />
      </el-popover>
    </div>
  </div>
</template>

<script>
/**
 * Mapboxdraw toolbox
 */
import { mapActions, mapGetters } from 'vuex';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import squareIcon from '@/assets/icons/square.svg';
import polygonIcon from '@/assets/icons/drawPolygonIcon.svg';
import lineIcon from '@/assets/icons/drawLineIcon.svg';
import pointIcon from '@/assets/icons/drawPointIcon.svg';
import drawStyles from '@/assets/drawStyles';
import collapseLeftIcon from '@/assets/icons/collapseLeftIcon.svg';
import collapseRigthIcon from '@/assets/icons/collapseRigthIcon.svg';
import trashIcon from '@/assets/icons/trashIcon.svg';
import undoIcon from '@/assets/icons/undoIcon.svg';
import addGeoIcon from '@/assets/icons/addGeoIcon.svg';
import subGeoIcon from '@/assets/icons/subGeoIcon.svg';
import snapIcon from '@/assets/icons/snapIcon.svg';
import compressIcon from '@/assets/icons/compressIcon.svg';
import expandIcon from '@/assets/icons/expandIcon.svg';
import cloneIcon from '@/assets/icons/cloneIcon.svg';

export default {
  components: {
    squareIcon,
    polygonIcon,
    lineIcon,
    pointIcon,
    collapseLeftIcon,
    collapseRigthIcon,
    trashIcon,
    undoIcon,
    addGeoIcon,
    subGeoIcon,
    snapIcon,
    compressIcon,
    expandIcon,
    cloneIcon
  },
  props: {
    /**
     * Sidebar toggle state
     */
    isSidebarOpen: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      draw: null,
      confirmDeleteVisibily: false
    };
  },
  mounted() {
    const draw = this.drawInit();
    /**
     * MapboxDraw instance created event.
     * @type {object}
     */
    this.$emit('draw-init', draw);
    this.draw = draw;
  },
  computed: {
    ...mapGetters({
      layers: 'layers/items',
      activeLayer: 'layers/currentItem',
      selectedFeature: 'selectedFeature',
      drawMode: 'drawMode',
      isMultiselect: 'isMultiselect',
      isEditionInProgress: 'isEditionInProgress',
      isSnapActive: 'isSnapActive'
    }),
    isDrawToolActive() {
      if (
        this.drawMode === 'draw_line_string' ||
        this.drawMode === 'draw_point' ||
        this.drawMode === 'draw_polygon' ||
        this.isEditionInProgress
      ) {
        return true;
      }
    },
    shouldDrawToolBeAnable() {
      if (this.selectedFeature === null) {
        return true;
      }
    },
    shouldCloneFeatureBeAnable() {
      if (this.selectedFeature && !this.isEditionInProgress) {
        return true;
      }
    },
    shouldAddSplitMultipartFeatureBeAnable() {
      if (this.selectedFeature && !this.isEditionInProgress) {
        return true;
      }
    },
    isAddSliplitMultipartToolActive() {
      // todo: draw mode do not exists anymore return this.drawMode === 'add_multipart_feature';
    }
  },
  methods: {
    ...mapActions({
      undoDrawAction: 'changes/undoChange',
      enterDrawMode: 'enterDrawMode'
    }),
    drawInit() {
      const Draw = new MapboxDraw({
        displayControlsDefault: false,
        userProperties: true,
        styles: drawStyles.styles
      });
      return Draw;
    },
    toggleSidebar() {
      this.$emit('toggle-sidebar');
    },
    addNewFeature() {
      this.$emit('add-new-feature');
    },
    addGeometry() {
      console.log('add-geometry');
      this.$emit('add-geometry-to-feature');
    },
    subtractGeometry() {
      console.log('subtract-geometry');
      this.$emit('subtract-geometry');
    },
    toggleSnap() {
      console.log('toggle-snap');
      this.$emit('toggle-snap');
    },
    mergeSelectedFeatures() {
      console.log('merge-selected-features');
      this.$emit('merge-selected-features');
    },
    splitMultfeature() {
      console.log('split-feature');
      this.$emit('slip-multifeature');
    },
    cloneFeature() {
      console.log('clone-feature');
      this.$emit('clone-feature');
    },
    trash() {
      this.confirmDeleteVisibily = false;
      this.draw.trash();
    }
  }
};
</script>

<style scoped>
.btn-group {
  margin-bottom: 30px;
}

.btn-group button {
  padding: 11px;
  cursor: pointer;
  display: block;
  width: 43px;
}

.active {
  color: #2e90e6;
  pointer-events: none;
}
.active:hover {
  cursor: pointer;
}

.active-toggle {
  color: #2e90e6;
}

.btn-group button:not(:last-child) {
  border-bottom: none; /* Prevent double borders */
}

.btn-group button:first-child {
  border-radius: 4px 4px 0px 0px;
}

.btn-group button:last-child {
  border-radius: 0px 0px 4px 4px;
}
</style>