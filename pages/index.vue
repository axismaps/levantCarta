]<template>
  <div class="container">
    <the-header
      class="header"
      @set-active-overlay="handleSetActiveOverlay"
      @set-overlay-opacity="handleSetOverlayOpacity"
    />
    <div class="sidebar">
      <the-sidebar v-show="showSidebar" @add-new-feature="handleAddNewFeature" />
      <the-toolbox
        class="toolbox"
        :showSidebar="showSidebar"
        @draw-init="handleDrawInit"
        @toggle-sidebar="handleTogglesidebar"
        @add-new-feature="handleAddNewFeature"
      />
    </div>
    <mapbox
      id="map"
      v-if="draw"
      :map-options="{
        style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json',
        center: [35.50411547, 33.89508665],
        zoom: 14,
        }"
      :geolocate-control="{
        show: true,
        position: 'top-right'
        }"
      @create-popup="handleCreatePopup"
      @delete-popup="handleDeletePopup"
      @popup-init="handleInitPopup"
      @map-init="handleMapInit"
      @map-load="handleMapLoad"
      @map-click="handleMapClick"
      @draw-selectionchange="handleSelectionchange"
      @draw-modechange="handleModechange"
      class="map"
    />
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';
import Mapbox from '~/components/Mapbox.vue';
import TheToolbox from '~/components/TheToolbox';
import TheHeader from '~/components/TheHeader';
import TheSidebar from '~/components/TheSidebar';
import tippy, { followCursor } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

const API = 'http://beirut.georio.levantcarta.org/api/v1/get/layers';
export default {
  components: {
    Mapbox,
    TheToolbox,
    TheHeader,
    TheSidebar
  },
  data() {
    return {
      showSidebar: true,
      map: null,
      draw: null,
      popup: null,
      featureBeingCreatedId: '',
      tippy: {}
    };
  },
  async fetch(context) {
    const {
      data: { response: layers }
    } = await axios.get(API);

    const { data: overlays } = await axios.get('/data/overlays.json');
    context.store.dispatch('overlays/setItems', overlays);
    context.store.dispatch('layers/setItems', layers);
  },
  watch: {
    drawMode() {
      this.showSidebar = true;
    },
    selectedFeature() {
      this.showSidebar = true;
    }
  },
  computed: {
    ...mapGetters({
      layers: 'layers/items',
      activeLayer: 'layers/currentItem',
      overlays: 'overlays/items',
      activeOverlay: 'overlays/currentItem',
      isEditionInProgress: 'isEditionInProgress',
      drawMode: 'drawMode',
      selectedFeature: 'selectedFeature'
    })
  },
  methods: {
    ...mapActions({
      setActiveOverlay: 'overlays/setCurrentItem',
      updateDrawMode: 'updateDrawMode',
      enterDrawMode: 'enterDrawMode',
      setDraw: 'setDraw',
      applyChange: 'changes/applyChange',
      saveFeature: 'features/saveFeature',
      updateSelectedFeature: 'updateSelectedFeature',
      updateDrawMode: 'updateDrawMode'
    }),
    handleInitPopup(popup) {
      this.popup = popup;
    },
    handleCreatePopup(feature) {
      if (this.selectedFeature) return;
      try {
        const { name, firstyear, lastyear, type } = this.draw.get(
          feature.id
        ).properties;

        const { title: typeTitle } = this.activeLayer.Types.find(el => {
          return el.id === type;
        });
        const description = `<span style="color: grey">Name: </span> ${name}
        <br>
        <span style="color: grey">Mapped: </span> ${firstyear} - ${lastyear}
        <br>
        <span style="color: grey">Type: </span> ${typeTitle}
        `;

        this.popup
          .setLngLat(feature.coordinates)
          .setHTML(description)
          .addTo(this.map);
      } catch (error) {}
    },
    handleDeletePopup() {
      try {
        this.popup.remove();
      } catch (e) {}
    },
    handleMapInit(map) {
      console.log('Here is the map:', map);
      this.map = map;
    },
    handleMapLoad() {
      this.loadOverlays(this.map);
      this.map.addControl(this.draw);
    },
    handleDrawInit(draw) {
      console.log('Here is the draw instance', draw);
      this.draw = draw;
      this.setDraw(draw);
    },
    handleTogglesidebar() {
      this.showSidebar = !this.showSidebar;
    },
    loadOverlays(map) {
      this.overlays.map(overlay => {
        map.addLayer({
          ...overlay,
          paint: {
            'raster-opacity': 0
          }
        });
      });
    },
    handleSetActiveOverlay(overlayId) {
      this.map.setPaintProperty(overlayId, 'raster-opacity', 1);
      this.setActiveOverlay(overlayId);
    },
    handleSetOverlayOpacity(opacity) {
      this.map.setPaintProperty(
        this.activeOverlay.id,
        'raster-opacity',
        opacity / 100
      );
    },
    handleMapClick(map, e) {
      if (this.tippy[0]) {
        this.tippy[0].destroy();
        this.tippy = [];
      }
      if (this.drawMode === 'draw_polygon') {
        const change = {
          type: 'draw.step',
          features: [
            {
              type: 'Polygon',
              coordinates: [e.lngLat.lng, e.lngLat.lat]
            }
          ]
        };
        this.applyChange(change);
      } else if (this.drawMode === 'draw_line_string') {
        const change = {
          type: 'draw.step',
          features: [
            {
              type: 'LineString',
              coordinates: [e.lngLat.lng, e.lngLat.lat]
            }
          ]
        };
        this.applyChange(change);
      }
    },
    handleSelectionchange(e) {
      this.updateSelectedFeature(e.features);

      console.log('selection change', e);
    },
    handleModechange(e) {
      this.updateDrawMode(e.mode);
    },
    handleAddNewFeature() {
      const activeLayerType = this.activeLayer.geometry;

      this.tippy = tippy('#map', {
        followCursor: true,
        plugins: [followCursor],
        content: 'click to start drawing'
      });

      switch (activeLayerType) {
        case 'point':
          this.enterDrawMode('draw_point');
          break;
        case 'line':
          this.enterDrawMode('draw_line_string');
          break;
        case 'polygon':
          this.enterDrawMode('draw_polygon');
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: grid;
  grid-template-columns: 60px repeat(4, 1fr);
  grid-template-rows: repeat(5, fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.map {
  grid-area: 2 / 1 / 6 / 6;
  height: calc(100vh - #{$header-height});
}
.sidebar {
  display: flex;
  height: 100%;
  z-index: 5;
  grid-area: 2 / 1 / 6 / 2;
  .toolbox {
    margin: 25px 15px;
  }
}
.header {
  grid-area: 1 / 1 / 2 / 6;
}
</style>