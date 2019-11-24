<template>
  <div :id="(mapOptions.hasOwnProperty('container') ? mapOptions.container : 'map')"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { mapActions, mapGetters } from 'vuex';
// import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'

export default {
  data() {
    return {
      mouseOverFeature: null
    };
  },
  props: {
    /**
     * Mapbox acess token
     */
    accessToken: {
      type: String
    },
    /**
     * Mapbox API options.
     * More at https://docs.mapbox.com/mapbox-gl-js/api/#map
     */
    mapOptions: {
      type: Object,
      required: true
    },
    /**
     * Navigation control
     */
    navControl: {
      type: Object,
      default: () => {
        return {
          show: true,
          position: 'top-right'
        };
      }
    },
    /**
     * Geolocate control
     */
    geolocateControl: {
      type: Object,
      default: () => {
        return {
          show: false,
          position: 'top-left',
          options: {}
        };
      }
    },
    /**
     * Scale control
     */
    scaleControl: {
      type: Object,
      default: () => {
        return {
          show: false,
          position: 'top-left',
          options: {}
        };
      }
    },
    /**
     * Fullscreen control
     */
    fullscreenControl: {
      type: Object,
      default: () => {
        return {
          show: false,
          position: 'top-right'
        };
      }
    }
  },
  mounted() {
    //Initialze Map
    const map = this.mapInit();

    //Add Controls to map
    this.addControls(map);

    //Register Map Events
    this.registerEvents(map);

    this.initPopup();
  },
  methods: {
    ...mapActions({
      updateDrawMode: 'updateDrawMode',
      updateSelectedFeature: 'updateSelectedFeature',
      applyChange: 'changes/applyChange'
    }),
    mapInit() {
      //Mapbox GL access token
      mapboxgl.accessToken = this.accessToken;

      //Add container to options object
      if (!this.mapOptions.hasOwnProperty('container')) {
        this.mapOptions.container = 'map';
      }

      //New Mapbox Instance
      const map = new mapboxgl.Map(this.mapOptions);

      /**
       * Mapbox instance created event.
       * @type {object}
       */
      this.$emit('map-init', map);

      return map;
    },
    initPopup() {
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true
      });
      this.$emit('popup-init', popup);
    },
    registerEvents(map) {
      map.on('mousemove', e => {
        const feature = map.queryRenderedFeatures(e.point)[0];
        if (this.mouseOverFeature == feature.properties.id) {
          if (feature.properties.id) {
            const coordinates = e.lngLat;
            this.$emit('create-popup', {
              coordinates,
              id: feature.properties.id
            });
          } else {
            this.$emit('delete-popup');
          }
        }
        this.mouseOverFeature = feature.properties.id;
      });

      map.on('load', () => {
        /**
         * Mapbox instance complete load event.
         * @type {object}
         */
        this.$emit('map-load', map);
      });

      //Draw Events
      map.on('draw.create', e => {
        /**
         * Draw feature create
         */
        this.$emit('draw-create', e);
        this.applyChange(e);
      });
      map.on('draw.update', e => {
        /**
         * Draw feature update
         */
        this.$emit('draw-update', e);
        this.applyChange(e);
      });
      map.on('draw.delete', e => {
        /**
         * Draw feature delete
         */
        this.$emit('draw-delete', e);
        this.applyChange(e);
      });
      map.on('draw.combine', e => {
        /**
         * Draw feature combine
         */
        this.$emit('draw-combine', e);
      });
      map.on('draw.uncombine', e => {
        /**
         * Draw feature uncombine
         */
        this.$emit('draw-uncombine', e);
      });
      map.on('draw.selectionchange', e => {
        /**
         * Draw selection change
         */
        this.updateSelectedFeature(e.features);
        this.$emit('draw-selectionchange', e);
      });
      map.on('draw.modechange', e => {
        /**
         * Draw mode change
         */
        this.updateDrawMode(e.mode);
        this.$emit('draw-modechange', e);
      });
      map.on('draw.render', e => {
        /**
         * Draw render
         */
        this.$emit('draw-render', e);
      });
      map.on('draw.actionable', e => {
        /**
         * Draw action anable
         */
        this.$emit('draw-actionable', e);
      });

      // map.on('mousemove', e => {
      //   /**
      //    * Map Mouse Move.
      //    * @type {object}
      //    */
      //   this.$emit('map-mousemove', map, e);
      // });

      // map.on('click', e => {
      //   /**
      //    * Map clicked.
      //    * @type {object}
      //    */
      //   this.$emit('map-click', map, e);
      // });

      // map.on('contextmenu', e => {
      //   /**
      //    * Map Context Menu
      //    * @type {object}
      //    */
      //   this.$emit('map-contextmenu', map, e);
      // });

      // map.on('resize', () => {
      //   /**
      //    * Map resized
      //    * @type {object}
      //    */
      //   this.$emit('map-resize', map);
      // });

      // map.on('resize', e => {
      //   /**
      //    * Map Webgl Context Lost
      //    * @type {object}
      //    */
      //   this.$emit('map-webglcontextlost', map, e);
      // });

      // map.on('resize', e => {
      //   /**
      //    * Map Webgl Context Restored
      //    * @type {object}
      //    */
      //   this.$emit('map-webglcontextrestored', map, e);
      // });

      // map.on('remove', () => {
      //   /**
      //    * Map removed
      //    * @type {object}
      //    */
      //   this.$emit('map-remove', map);
      // });

      // map.on('sourcedataloading', e => {
      //   /**
      //    * Map Source Data Loading
      //    * @type {object}
      //    */
      //   this.$emit('map-sourcedataloading', map, e);
      // });

      // map.on('touchstart', e => {
      //   /**
      //    * Map Touch Start
      //    * @type {object}
      //    */
      //   this.$emit('map-touchstart', map, e);
      // });

      // map.on('movestart', e => {
      //   /**
      //    * Map Move Start
      //    * @type {object}
      //    */
      //   this.$emit('map-movestart', map, e);
      // });

      // map.on('movestart', e => {
      //   /**
      //    * Map Touch Move
      //    * @type {object}
      //    */
      //   this.$emit('map-movestart', map, e);
      // });

      // map.on('move', e => {
      //   /**
      //    * Map  Move
      //    * @type {object}
      //    */
      //   this.$emit('map-move', map, e);
      // });

      // map.on('moveend', e => {
      //   /**
      //    * Map Move end
      //    * @type {object}
      //    */
      //   this.$emit('map-moveend', map, e);
      // });

      // map.on('error', e => {
      //   /**
      //    * Map Error
      //    * @type {object}
      //    */
      //   this.$emit('map-error', map, e);
      // });

      // map.on('data', e => {
      //   /**
      //    * Map Data
      //    * @type {object}
      //    */

      //   this.$emit('map-data', map, e);
      // });

      // map.on('styledata', e => {
      //   /**
      //    * Map Style Data
      //    * @type {object}
      //    */

      //   this.$emit('map-styledata', map, e);
      // });

      // map.on('mouseup', e => {
      //   /**
      //    * Map Mouse Up
      //    * @type {object}
      //    */

      //   this.$emit('map-mouseup', map, e);
      // });

      // map.on('touchcancel', e => {
      //   /**
      //    * Map Touch Cancel
      //    * @type {object}
      //    */

      //   this.$emit('map-touchcancel', map, e);
      // });

      // map.on('sourcedata', e => {
      //   /**
      //    * Map Source Data
      //    * @type {object}
      //    */

      //   this.$emit('map-sourcedata', map, e);
      // });

      // map.on('dataloading', e => {
      //   /**
      //    * Map Data Loading
      //    * @type {object}
      //    */

      //   this.$emit('map-dataloading', map, e);
      // });

      // map.on('styledataloading', e => {
      //   /**
      //    * Map Style Data Loading
      //    * @type {object}
      //    */

      //   this.$emit('map-styledataloading', map, e);
      // });

      // map.on('dblclick', e => {
      //   /**
      //    * Map Double Click
      //    * @type {object}
      //    */

      //   this.$emit('map-dblclick', map, e);
      // });

      // map.on('render', () => {
      //   /**
      //    * Map Render
      //    * @type {object}
      //    */

      //   this.$emit('map-render', map);
      // });

      // map.on('mouseout', e => {
      //   /**
      //    * Map Mouse Out
      //    * @type {object}
      //    */

      //   this.$emit('map-mouseout', map, e);
      // });

      // map.on('mousedown', e => {
      //   /**
      //    * Map Mouse Down
      //    * @type {object}
      //    */

      //   this.$emit('map-mousedown', map, e);
      // });

      // map.on('touchend', e => {
      //   /**
      //    * Map Touch End
      //    * @type {object}
      //    */

      //   this.$emit('map-touchend', map, e);
      // });

      // map.on('zoomstart', e => {
      //   /**
      //    * Map Zoom Start
      //    * @type {object}
      //    */

      //   this.$emit('map-zoomstart', map, e);
      // });

      // map.on('zoomend', e => {
      //   /**
      //    * Map Zoom End
      //    * @type {object}
      //    */

      //   this.$emit('map-zoomend', map, e);
      // });

      // map.on('zoom', e => {
      //   this.$emit('map-zoom', map, e);
      // });

      // map.on('boxzoomcancel', e => {
      //   /**
      //    * Map Box Zoom Cancel
      //    * @type {object}
      //    */
      //   this.$emit('map-boxzoomcancel', map, e);
      // });

      // map.on('boxzoomend', e => {
      //   this.$emit('map-boxzoomend', map, e);
      // });

      // map.on('boxzoomstart', e => {
      //   /**
      //    * Map Box Zoom Start
      //    * @type {object}
      //    */
      //   this.$emit('map-boxzoomstart', map, e);
      // });

      // map.on('rotatestart', e => {
      //   /**
      //    * Map Rotate Start
      //    * @type {object}
      //    */
      //   this.$emit('map-rotatestart', map, e);
      // });

      // map.on('rotate', e => {
      //   /**
      //    * Map Rotate
      //    * @type {object}
      //    */
      //   this.$emit('map-rotate', map, e);
      // });

      // map.on('rotateend', e => {
      //   /**
      //    * Map Rotate End
      //    * @type {object}
      //    */
      //   this.$emit('map-rotateend', map, e);
      // });

      // map.on('dragend', e => {
      //   /**
      //    * Map Drag End
      //    * @type {object}
      //    */
      //   this.$emit('map-dragend', map, e);
      // });

      // map.on('drag', e => {
      //   /**
      //    * Map Drag
      //    * @type {object}
      //    */
      //   this.$emit('map-drag', map, e);
      // });

      // map.on('dragstart', e => {
      //   /**
      //    * Map Drag Start
      //    * @type {object}
      //    */
      //   this.$emit('map-dragstart', map, e);
      // });

      // map.on('pitch', e => {
      //   /**
      //    * Map Pitch
      //    * @type {object}
      //    */
      //   this.$emit('map-pitch', map, e);
      // });

      // map.on('pitchstart', e => {
      //   /**
      //    * Map Pitch Start
      //    * @type {object}
      //    */
      //   this.$emit('map-pitchstart', map, e);
      // });

      // map.on('pitchend', e => {
      //   /**
      //    * Map Pitch End
      //    * @type {object}
      //    */
      //   this.$emit('map-pitchend', map, e);
      // });
    },
    addControls(map) {
      //Nav Control
      if (this.navControl.show) {
        const nav = new mapboxgl.NavigationControl();
        map.addControl(nav, this.navControl.position);
      }

      //Geolocation Control
      if (this.geolocateControl.show) {
        const geolocate = new mapboxgl.GeolocateControl(
          this.geolocateControl.options
        );
        map.addControl(geolocate, this.geolocateControl.position);
      }

      //Scale Control
      if (this.scaleControl.show) {
        const scale = new mapboxgl.ScaleControl(this.scaleControl.options);
        map.addControl(scale, this.scaleControl.position);
        map.on('load', function() {
          // Insert the layer beneath any symbol layer.
          var layers = map.getStyle().layers;

          var labelLayerId;
          for (var i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
              labelLayerId = layers[i].id;
              break;
            }
          }
        });
      }

      //Fullscreen Control
      if (this.fullscreenControl.show) {
        const fullscreen = new mapboxgl.FullscreenControl();
        map.addControl(fullscreen, this.fullscreenControl.position);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#map {
  width: 100%;
}
.mapboxgl-canvas {
  width: 100%;
  padding: 0px;
  margin: 0px;
}
</style>
