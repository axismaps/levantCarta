<template>
  <div>
    <div class="btn-group el-button-group">
      <el-button v-if="showSidebar" size="small" icon="el-icon-arrow-left" @click="toggleSidebar" />
      <el-button v-else size="small" icon="el-icon-arrow-right" @click="toggleSidebar" />
    </div>
    <div class="btn-group el-button-group">
      <el-button size="small" icon="el-icon-position" @click="anableDirectSelectMode"></el-button>
    </div>
    <div class="btn-group el-button-group">
      <el-button size="small" @click="anableDrawPointMode" :disabled="activeLayer.type !== 'Point'">
        <point-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>
      <el-button size="small" @click="anableDrawLineMode" :disabled="activeLayer.type !== 'LineString'">
        <line-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>
      <el-button size="small" @click="anableDrawPolygonMode" :disabled="activeLayer.type !== 'Polygon'">
        <polygon-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>
    </div>
    <div class="btn-group el-button-group">
      <el-button size="small" icon="el-icon-delete" @click="trash" />
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

export default {
  components: {
    squareIcon,
    polygonIcon,
    lineIcon,
    pointIcon
  },
  props: {
    showSidebar: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      draw: null
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
      activeLayer: 'layers/currentItem'
    })
  },
  methods: {
    drawInit() {
      const Draw = new MapboxDraw();
      return Draw;
    },
    toggleSidebar() {
      this.$emit('toggle-sidebar');
    },
    anableDirectSelectMode() {
      console.log(this.draw.getAll());
    },
    anableDrawPointMode() {
      this.draw.changeMode('draw_point');
    },
    anableDrawLineMode() {
      // console.log('draw');
      // this.draw.add({ type: 'Point', coordinates: [0, 0] });
      // console.log(this.draw.deleteAll().getAll())
      this.draw.changeMode('draw_line_string');
    },
    anableDrawPolygonMode() {
      this.draw.changeMode('draw_polygon');
    },
    trash() {
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
  padding: 13px;
  cursor: pointer;
  display: block;
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