<template>
  <div>
    <div class="el-button-group btn-group">
      <el-button v-if="showSidebar" @click="toggleSidebar">
        <collapse-left-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>

      <el-button v-else size="small" @click="toggleSidebar">
        <collapse-rigth-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>
    </div>
    <div class="el-button-group btn-group">
      <el-button
        @click="anableDrawPointMode"
        v-if="activeLayer && activeLayer.geometry == 'point'"
        :disabled="activeLayer.geometry !== 'point'"
      >
        <point-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>
      <el-button
        @click="anableDrawLineMode"
        v-if="activeLayer && activeLayer.geometry == 'line'"
        :disabled="activeLayer.geometry !== 'line'"
      >
        <line-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>
      <el-button
        @click="anableDrawPolygonMode"
        v-if="activeLayer && activeLayer.geometry == 'polygon'"
        :disabled="activeLayer.geometry !== 'polygon'"
      >
        <polygon-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>
    </div>

    <div class="el-button-group btn-group">
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

export default {
  components: {
    squareIcon,
    polygonIcon,
    lineIcon,
    pointIcon,
    collapseLeftIcon,
    collapseRigthIcon,
    trashIcon,
    undoIcon
  },
  props: {
    showSidebar: {
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
      selectedFeature: 'selectedFeature'
    })
  },
  methods: {
    ...mapActions({
      undoDrawAction: 'changes/undoChange',
      updateDrawMode: 'updateDrawMode'
    }),
    drawInit() {
      const Draw = new MapboxDraw({
        // displayControlsDefault: false,
        userProperties: true,
        styles: drawStyles.styles
      });
      return Draw;
    },
    toggleSidebar() {
      this.$emit('toggle-sidebar');
    },
    anableDrawPointMode() {
      this.draw.changeMode('draw_point');
      this.updateDrawMode('draw_point');
    },
    anableDrawLineMode() {
      this.draw.changeMode('draw_line_string');
      this.updateDrawMode('draw_line_string');
    },
    anableDrawPolygonMode() {
      this.draw.changeMode('draw_polygon');
      this.updateDrawMode('draw_polygon');
    },
    trash() {
      this.confirmDeleteVisibily = false;
      this.draw.trash();
    }
  }
};
</script>

<style  scoped>
.btn-group {
  margin-bottom: 30px;
}

.btn-group button {
  padding: 11px;
  cursor: pointer;
  display: block;
  width: 43px;
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