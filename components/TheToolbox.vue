<template>
  <div>
    <div id="toggle-sidebar-control" class="el-button-group btn-group">
      <el-button v-if="isSidebarOpen" @click="toggleSidebar">
        <collapse-left-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>

      <el-button v-else size="small" @click="toggleSidebar">
        <collapse-rigth-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>
    </div>

    <div
      id="draw-feature-control"
      class="el-button-group btn-group"
      :class="{ active: isToolActive }"
    >
      <el-button
        id="add-point-btn"
        @click="addNewFeature"
        v-if="activeLayer && activeLayer.geometry == 'point'"
        :disabled="isToolActive"
      >
        <point-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>
      <el-button
        id="add-line-btn"
        @click="addNewFeature"
        v-if="activeLayer && activeLayer.geometry == 'line'"
        :disabled="isToolActive"
      >
        <line-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>
      <el-button
        id="add-polygon-btn"
        @click="addNewFeature"
        v-if="activeLayer && activeLayer.geometry == 'polygon'"
        :disabled="isToolActive"
      >
        <polygon-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>
      <el-button id="add-geo-btn" @click="addNewFeature" :disabled="isToolActive">
        <add-geo-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>
      <el-button id="sub-geo-btn" @click="addNewFeature" :disabled="isToolActive">
        <sub-geo-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>
      <el-button id="snap-btn" @click="addNewFeature" :disabled="isToolActive">
        <snap-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>
    </div>

    <div id="splip/merge-controls" class="el-button-group btn-group">
      <el-button id="merge-btn" @click="addNewFeature" :disabled="isToolActive">
        <compress-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>

      <el-button id="split-btn" @click="addNewFeature" :disabled="isToolActive">
        <expand-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>
    </div>

    <div id="clone-control" class="el-button-group btn-group">
      <el-button id="clone-btn" @click="addNewFeature" :disabled="isToolActive">
        <clone-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>
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
      drawMode: 'drawMode'
    }),
    isToolActive() {
      if (
        this.drawMode === 'draw_line_string' ||
        this.drawMode === 'draw_point' ||
        this.drawMode === 'draw_polygon'
      ) {
        return true;
      }
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

.active button {
  color: #2e90e6;
  border-color: #2e90e6;
}
.active button:hover {
  cursor: pointer;
  color: #2e90e6;
  border-color: #2e90e6;
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