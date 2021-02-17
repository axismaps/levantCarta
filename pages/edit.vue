<template>
  <div class="container">
    <!-- <div class="debug-container">
      stateMachine: {{aplicationState}}
      <br />
      isEditionInProgress: {{isEditionInProgress}}
      <br />
      {{features.length}}
      <pre>{{features}}</pre>
    </div>-->
    <the-header
      class="header"
      @set-active-overlay="handleSetActiveOverlay"
      @set-overlay-opacity="handleSetOverlayOpacity"
    />
    <div class="sidebar">
      <the-sidebar
        v-show="showSidebar"
        @add-new-feature="handleAddNewFeature"
      />
      <the-toolbox
        class="toolbox"
        :isSidebarOpen="showSidebar"
        @add-geometry-to-feature="handleAddGeometryToFeature"
        @add-new-feature="handleAddNewFeature"
        @clone-feature="handleCloneFeature"
        @draw-init="handleDrawInit"
        @merge-selected-features="handleMergeSelectedFeatures"
        @slip-multifeature="handleSplitMultifeature"
        @toggle-sidebar="handleTogglesidebar"
        @toggle-snap="handleToggleSnap"
      />
    </div>
    <mapbox
      id="map"
      class="map"
      v-if="draw"
      :map-options="{
        style: 'mapbox://styles/mapbox/satellite-v9',
        accessToken: mapboxToken,
        center: [35.50411547, 33.89508665],
        zoom: 14,
      }"
      :geolocate-control="{
        show: true,
        position: 'top-right',
      }"
      @create-popup="handleCreatePopup"
      @delete-popup="handleDeletePopup"
      @draw-create="handleDrawCreate"
      @draw-delete="handleDrawDelete"
      @draw-modechange="handleModechange"
      @draw-selectionchange="handleSelectionchange"
      @draw-update="handleDrawUpdate"
      @map-click="handleMapClick"
      @map-init="handleMapInit"
      @map-load="handleMapLoad"
      @mouse-enter-point="handleMouseOverPoint"
      @mouse-leave-point="updateSnapPoint(null)"
      @popup-init="handleInitPopup"
    />
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';
import Mapbox from '@/components/Mapbox.vue';
import TheToolbox from '@/components/TheToolbox';
import TheHeader from '@/components/TheHeader';
import TheSidebar from '@/components/TheSidebar';
import tippy, { followCursor } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { featuresToPoints } from '@/assets/lib/Helpers';
import { states, transition } from '@/assets/lib/StateMachine';

import changeSets from '@/assets/changeSets';
import changes from '@/assets/changes';

localStorage.setItem('changeSets', JSON.stringify(changeSets));
localStorage.setItem('changes', JSON.stringify(changes));

const API = process.env.API;
export default {
  middleware: 'auth',
  components: {
    Mapbox,
    TheToolbox,
    TheHeader,
    TheSidebar,
  },
  data() {
    return {
      aplicationState: 'idle',
      showSidebar: true,
      map: null,
      draw: null,
      popup: null,
      featureBeingCreatedId: '',
      featureBeingSplit: null,
      tippy: {},
    };
  },
  async fetch(context) {
    const {
      data: { response: layers },
    } = await axios.get(`${API}/get/layers`);

    const { data: overlays } = await axios.get('/data/overlays.json');
    context.store.dispatch('overlays/setItems', overlays);
    context.store.dispatch('layers/setItems', layers);
    //TODO: isso nao vai ser mais necessário
    // context.store.dispatch('changes/setUnsubmittedChanges');
  },
  watch: {
    drawMode() {
      this.showSidebar = true;
    },
    selectedFeature() {
      this.showSidebar = true;
    },
  },
  computed: {
    ...mapGetters({
      attributeForm: 'attributeForm',
      activeLayer: 'layers/currentItem',
      activeOverlay: 'overlays/currentItem',
      drawMode: 'drawMode',
      featureBeingDrawn: 'featureBeingDrawn',
      isAttributeFormValid: 'isAttributeFormValid',
      isEditionInProgress: 'isEditionInProgress',
      isSnapActive: 'isSnapActive',
      layers: 'layers/items',
      multiselectedFeatures: 'multiselectedFeatures',
      overlays: 'overlays/items',
      selectedFeature: 'selectedFeature',
      snapPoint: 'snapPoint',
      features: 'features/features',
    }),
    mapboxToken() {
      return process.env.mapboxToken;
    },
    isGeometryBeingDrawn() {
      if (
        this.featureBeingDrawn ||
        this.drawMode === 'draw_polygon' ||
        this.drawMode === 'draw_line_string' ||
        this.drawMode === 'draw_point'
      ) {
        return true;
      }
    },
    geometryBeingDrawnType() {
      const drawMode = this.drawMode;

      switch (drawMode) {
        case 'draw_polygon':
          return 'Polygon';
          break;
        case 'draw_line_string':
          return 'LineString';
          break;
        case 'draw_point':
          return 'Point';
        default:
          break;
      }
    },
  },
  methods: {
    ...mapActions({
      addGeometryToFeature: 'addGeometryToFeature',
      // createFeature: 'changes/createFeature',
      // deleteFeature: 'changes/deleteFeature',
      drawMode: 'drawMode',
      // editFeature: 'changes/editFeature',
      enterDrawMode: 'enterDrawMode',
      mergeSelectedFeatures: 'mergeSelectedFeatures',
      pushGeometryBeingDrawPoint: 'pushGeometryBeingDrawPoint',
      createFeature: 'features/createFeature',
      setActiveOverlay: 'overlays/setCurrentItem',
      setDraw: 'setDraw',
      updateDrawMode: 'updateDrawMode',
      editFeature: 'features/editFeature',
      deleteFeature: 'features/deleteFeature',
      updateFeatureBeingDrawn: 'updateFeatureBeingDrawn',
      updateSelectedFeature: 'updateSelectedFeature',
      updateSnapPoint: 'updateSnapPoint',
      updateSnapStatus: 'updateSnapStatus',
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

        const { title: typeTitle } = this.activeLayer.Types.find((el) => {
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
      // this.loadOverlays(this.map);
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
      this.overlays.map((overlay) => {
        map.addLayer({
          ...overlay,
          paint: {
            'raster-opacity': 0,
          },
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
    async handleMapClick(map, e) {
      if (!this.isGeometryBeingDrawn) return;
      if (this.aplicationState === 'edit_feature.editing') return; // FIXME: we should handle this logic to anable snap on feature editing

      const clickPointLocation =
        this.snapPoint !== null
          ? this.snapPoint.coordinates
          : [e.lngLat.lng, e.lngLat.lat];

      try {
        const featureBeingDrawn = this.featureBeingDrawn.addCoordinate(
          clickPointLocation
        );

        this.updateFeatureBeingDrawn(featureBeingDrawn);

        const geometryType = this.geometryBeingDrawnType;

        this.createTooltip(`Click to continue drawing ${geometryType}`);

        //FIXME: rewrite undo logic
        // const changeAction = {
        //   type: 'draw.step',
        //   features: [
        //     {
        //       type: geometryType,
        //       coordinates: clickPointLocation
        //     }
        //   ]
        // };

        // await this.applyChange(changeAction);
      } catch (error) {}
    },

    async handleToggleSnap() {
      if (!this.isSnapActive) {
        this.updateSnapStatus(true);
        const allFeatures = await this.draw.getAll();
        const snapPoints = await featuresToPoints(allFeatures);
        console.log(snapPoints);
        const snapLayer = {
          id: 'snapLayer',
          type: 'circle',
          source: {
            type: 'geojson',
            data: snapPoints,
          },
          layout: {},
          paint: {
            'circle-radius': 5,
            'circle-color': '#007cbf',
          },
        };
        this.map.addLayer(snapLayer);
      } else {
        this.updateSnapStatus(false);
        this.map.removeLayer('snapLayer');
        this.map.removeSource('snapLayer');
      }
    },
    handleMouseLeavePoint() {
      console.log('mouse leave point');
    },
    async handleSelectionchange(e) {
      let { features } = e;
      if (this.aplicationState === 'idle') {
        this.updateSelectedFeature(features);
        this.aplicationState = 'edit_feature.editing';
        this.aplicationState = await transition(this, this.aplicationState, e);
      } else if (
        !features[0] &&
        this.aplicationState === 'edit_feature.editing'
      ) {
        this.aplicationState = 'edit_feature.after_editing';
        this.aplicationState = await transition(this, this.aplicationState, e);
      } else {
        this.aplicationState = await transition(this, this.aplicationState, e);
      }
    },
    handleModechange(e) {
      // /**
      //  *  autochange mode is actualy necessary? yes.
      //  */
      const mode = this.drawMode;
      this.updateDrawMode(e.mode);
    },
    async handleDrawCreate(e) {
      if (this.tippy[0]) {
        this.tippy[0].destroy();
        this.tippy = [];
      }
      this.aplicationState = await transition(this, this.aplicationState, e);
      if (this.aplicationState !== 'idle') return;
    },
    async handleDrawUpdate(e) {
      this.aplicationState = await transition(this, this.aplicationState, e);
    },
    async handleDrawDelete(e) {
      //TODO: state machine
      return;
    },
    handleMouseOverPoint(point) {
      console.log('mouse over point: ', point);

      this.updateSnapPoint(point);
      if (this.tippy[0]) {
        this.createTooltip({
          content: 'Click again to finish drawing',
        });
      }
    },
    async handleAddNewFeature() {
      this.aplicationState = 'add_new_feature.before_drawing';
      this.aplicationState = await transition(this, this.aplicationState);
    },
    async handleCloneFeature() {
      this.aplicationState = 'clone_feature.cloning';
      this.aplicationState = await transition(this, this.aplicationState);
    },
    async handleMergeSelectedFeatures() {
      this.aplicationState = 'merge_feature.merging';
      this.aplicationState = await transition(this, this.aplicationState);
    },
    async handleAddGeometryToFeature() {
      this.aplicationState = 'add_geometry_to_feature.before_drawing';
      this.aplicationState = await transition(this, this.aplicationState);
    },
    async handleSplitMultifeature() {
      this.aplicationState = 'split_multipart_feature.before_splitting';
      this.aplicationState = await transition(this, this.aplicationState);
    },
    createTooltip(options) {
      if (this.tippy[0]) {
        this.tippy[0].destroy();
        this.tippy = [];
      }
      this.tippy = tippy('#map', {
        ...options,
        trigger: 'mouseenter focus click',
        followCursor: true,
        plugins: [followCursor],
      });
    },
  },
};
</script>

<style scoped>
.debug-container {
  height: 400px;
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  z-index: 1000;
  display: block;
  position: fixed;
  background-color: aliceblue;
  right: 10px;
  top: 300px;
}
.container {
  display: grid;
  grid-template-columns: 60px repeat(4, 1fr);
  grid-template-rows: repeat(5, fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.map {
  grid-area: 2 / 1 / 6 / 6;
  height: calc(100vh - var(--header-height));
}
.sidebar {
  display: flex;
  height: 100%;
  z-index: 5;
  grid-area: 2 / 1 / 6 / 2;
}
.toolbox {
  margin: 25px 15px;
}
.header {
  grid-area: 1 / 1 / 2 / 6;
}
</style>