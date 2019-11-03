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
      <el-button
        size="small"
        @click="anableDrawPointMode"
        :disabled="activeLayer.geometryType !== 'Point'"
      >
        <point-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>
      <el-button
        size="small"
        @click="anableDrawLineMode"
        :disabled="activeLayer.geometryType !== 'LineString'"
      >
        <line-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>
      <el-button
        size="small"
        @click="anableDrawPolygonMode"
        :disabled="activeLayer.geometryType !== 'Polygon'"
      >
        <polygon-icon viewBox="0 0 22 22" class="img-responsive" />
      </el-button>
    </div>

    <div class="btn-group el-button-group">
      <el-button slot="reference" size="small" @click="undoDrawAction" icon="el-icon-refresh-left" />

      <el-popover placement="right" width="190" v-model="confirmDeleteVisibily">
        <p>
          Are you sure to delete
          <br />this feature?
        </p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="confirmDeleteVisibily = false">cancel</el-button>
          <el-button type="primary" size="mini" @click="trash">confirm</el-button>
        </div>
        <el-button slot="reference" size="small" icon="el-icon-delete" />
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
      activeLayer: 'layers/currentItem'
    })
  },
  methods: {
    ...mapActions({
      undoDrawAction: 'changes/undoChange',
      updateDrawMode: 'updateDrawMode'
    }),
    drawInit() {
      const Draw = new MapboxDraw({
        displayControlsDefault: false,
        userProperties: true,
        styles: [
          {
            id: 'gl-draw-polygon-fill-inactive',
            type: 'fill',
            filter: [
              'all',
              ['==', 'active', 'false'],
              ['==', '$type', 'Polygon'],
              ['!=', 'mode', 'static']
            ],
            paint: {
              'fill-color': '#3bb2d0',
              'fill-outline-color': '#3bb2d0',
              'fill-opacity': 0.1
            }
          },
          {
            id: 'gl-draw-polygon-fill-inactive-not-approved',
            type: 'fill',
            filter: [
              'all',
              ['==', 'active', 'false'],
              ['==', '$type', 'Polygon'],
              ['!=', 'mode', 'static'],
              ['==', 'user_approved', 'false']
            ],
            paint: {
              'fill-color': '#aff424',
              'fill-outline-color': '#aff424',
              'fill-opacity': 0.1
            }
          },
          {
            id: 'gl-draw-polygon-fill-active',
            type: 'fill',
            filter: [
              'all',
              ['==', 'active', 'true'],
              ['==', '$type', 'Polygon']
            ],
            paint: {
              'fill-color': '#fbb03b',
              'fill-outline-color': '#fbb03b',
              'fill-opacity': 0.1
            }
          },
          {
            id: 'gl-draw-polygon-midpoint',
            type: 'circle',
            filter: [
              'all',
              ['==', '$type', 'Point'],
              ['==', 'meta', 'midpoint']
            ],
            paint: {
              'circle-radius': 3,
              'circle-color': '#fbb03b'
            }
          },
          {
            id: 'gl-draw-polygon-stroke-inactive',
            type: 'line',
            filter: [
              'all',
              ['==', 'active', 'false'],
              ['==', '$type', 'Polygon'],
              ['!=', 'mode', 'static']
            ],
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#3bb2d0',
              'line-width': 2
            }
          },
          {
            id: 'gl-draw-polygon-stroke-inactive-not-approved',
            type: 'line',
            filter: [
              'all',
              ['==', 'active', 'false'],
              ['==', '$type', 'Polygon'],
              ['!=', 'mode', 'static'],
              ['==', 'user_approved', 'false']
            ],
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#aff424',
              'line-width': 2
            }
          },
          {
            id: 'gl-draw-polygon-stroke-active',
            type: 'line',
            filter: [
              'all',
              ['==', 'active', 'true'],
              ['==', '$type', 'Polygon']
            ],
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#fbb03b',
              'line-dasharray': [0.2, 2],
              'line-width': 2
            }
          },
          {
            id: 'gl-draw-line-inactive',
            type: 'line',
            filter: [
              'all',
              ['==', 'active', 'false'],
              ['==', '$type', 'LineString'],
              ['!=', 'mode', 'static']
            ],
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#3bb2d0',
              'line-width': 2
            }
          },
          {
            id: 'gl-draw-line-inactive-not-approved',
            type: 'line',
            filter: [
              'all',
              ['==', 'active', 'false'],
              ['==', '$type', 'LineString'],
              ['!=', 'mode', 'static'],
              ['==', 'user_approved', 'false']
            ],
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#aff424',
              'line-width': 2
            }
          },
          {
            id: 'gl-draw-line-active',
            type: 'line',
            filter: [
              'all',
              ['==', '$type', 'LineString'],
              ['==', 'active', 'true']
            ],
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#fbb03b',
              'line-dasharray': [0.2, 2],
              'line-width': 2
            }
          },
          {
            id: 'gl-draw-polygon-and-line-vertex-stroke-inactive',
            type: 'circle',
            filter: [
              'all',
              ['==', 'meta', 'vertex'],
              ['==', '$type', 'Point'],
              ['!=', 'mode', 'static']
            ],
            paint: {
              'circle-radius': 5,
              'circle-color': '#fff'
            }
          },
          {
            id: 'gl-draw-polygon-and-line-vertex-inactive',
            type: 'circle',
            filter: [
              'all',
              ['==', 'meta', 'vertex'],
              ['==', '$type', 'Point'],
              ['!=', 'mode', 'static']
            ],
            paint: {
              'circle-radius': 3,
              'circle-color': '#fbb03b'
            }
          },
          {
            id: 'gl-draw-point-point-stroke-inactive',
            type: 'circle',
            filter: [
              'all',
              ['==', 'active', 'false'],
              ['==', '$type', 'Point'],
              ['==', 'meta', 'feature'],
              ['!=', 'mode', 'static']
            ],
            paint: {
              'circle-radius': 5,
              'circle-opacity': 1,
              'circle-color': '#fff'
            }
          },
          {
            id: 'gl-draw-point-inactive',
            type: 'circle',
            filter: [
              'all',
              ['==', 'active', 'false'],
              ['==', '$type', 'Point'],
              ['==', 'meta', 'feature'],
              ['!=', 'mode', 'static']
            ],
            paint: {
              'circle-radius': 4,
              'circle-color': '#3bb2d0'
            }
          },
          {
            id: 'gl-draw-point-inactive-not-approved',
            type: 'circle',
            filter: [
              'all',
              ['==', 'active', 'false'],
              ['==', '$type', 'Point'],
              ['==', 'meta', 'feature'],
              ['!=', 'mode', 'static'],
              ['==', 'user_approved', 'false']
            ],
            paint: {
              'circle-radius': 4,
              'circle-color': '#aff424'
            }
          },
          {
            id: 'gl-draw-point-stroke-active',
            type: 'circle',
            filter: [
              'all',
              ['==', '$type', 'Point'],
              ['==', 'active', 'true'],
              ['!=', 'meta', 'midpoint']
            ],
            paint: {
              'circle-radius': 7,
              'circle-color': '#fff'
            }
          },
          {
            id: 'gl-draw-point-active',
            type: 'circle',
            filter: [
              'all',
              ['==', '$type', 'Point'],
              ['!=', 'meta', 'midpoint'],
              ['==', 'active', 'true']
            ],
            paint: {
              'circle-radius': 5,
              'circle-color': '#fbb03b'
            }
          },
          {
            id: 'gl-draw-polygon-fill-static',
            type: 'fill',
            filter: [
              'all',
              ['==', 'mode', 'static'],
              ['==', '$type', 'Polygon']
            ],
            paint: {
              'fill-color': '#404040',
              'fill-outline-color': '#404040',
              'fill-opacity': 0.1
            }
          },
          {
            id: 'gl-draw-polygon-stroke-static',
            type: 'line',
            filter: [
              'all',
              ['==', 'mode', 'static'],
              ['==', '$type', 'Polygon']
            ],
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#404040',
              'line-width': 2
            }
          },
          {
            id: 'gl-draw-line-static',
            type: 'line',
            filter: [
              'all',
              ['==', 'mode', 'static'],
              ['==', '$type', 'LineString']
            ],
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#404040',
              'line-width': 2
            }
          },
          {
            id: 'gl-draw-point-static',
            type: 'circle',
            filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Point']],
            paint: {
              'circle-radius': 5,
              'circle-color': '#404040'
            }
          }
        ]
      });
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
      //TODO: emit the change here
      console.log('trash');
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