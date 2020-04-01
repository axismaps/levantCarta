<template>
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
        :isSidebarOpen="showSidebar"
        @draw-init="handleDrawInit"
        @toggle-sidebar="handleTogglesidebar"
        @add-new-feature="handleAddNewFeature"
        @clone-feature="handleCloneFeature"
        @merge-selected-features="handleMergeSelectedFeatures"
        @add-geometry-to-feature="handleAddGeometryToFeature(geometryAddingState)"
        @slip-multifeature="handleSplitMultifeature(featureSplittingStep,selectedFeature)"
        @toggle-snap="handleToggleSnap"
      />
    </div>
    <mapbox
      id="map"
      v-if="draw"
      :map-options="{
        style: 'mapbox://styles/mapbox/satellite-v9',
        accessToken: mapboxToken, 
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
      @draw-create="handleDrawCreate"
      @draw-update="handleDrawUpdate"
      @draw-delete="handleDrawDelete"
      @mouse-enter-point="handleMouseOverPoint"
      @mouse-leave-point="updateSnapPoint(null)"
      class="map"
    />
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';
import Mapbox from '@/components/Mapbox.vue';
import uuidv4 from 'uuid/v4';
import TheToolbox from '@/components/TheToolbox';
import TheHeader from '@/components/TheHeader';
import TheSidebar from '@/components/TheSidebar';
import tippy, { followCursor } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { Feature } from '@/assets/lib/feature';
import {
  mergeFeatures,
  featuresToPoints,
  pointsToFeature
} from '@/assets/lib/helpers';

const API = process.env.API;

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
      featureBeingSplitted: null,
      featureSplittingStep: 'before_splitting',
      geometryAddingState: 'before_drawing',
      tippy: {}
    };
  },
  async fetch(context) {
    const {
      data: { response: layers }
    } = await axios.get(`${API}/get/layers`);

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
      selectedFeature: 'selectedFeature',
      multiselectedFeatures: 'multiselectedFeatures',
      isSnapActive: 'isSnapActive',
      snapPoint: 'snapPoint',
      geometryBeingDrawnPoints: 'geometryBeingDrawnPoints',
      featureBeingDrawn: 'featureBeingDrawn'
    }),
    mapboxToken() {
      return process.env.mapboxToken;
    },
    isGeometryBeingDrawn() {
      if (
        this.drawMode === 'draw_polygon' ||
        this.drawMode === 'draw_line_string' ||
        this.drawMode === 'draw_point' ||
        this.drawMode === 'add_multipart_feature'
      ) {
        return true;
      }
    },
    geometryBeingDrawnType() {
      const drawMode = this.drawMode;

      if (drawMode === 'add_multipart_feature') {
        return this.selectedFeature.geometry.type;
      }

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
    }
  },
  methods: {
    ...mapActions({
      setActiveOverlay: 'overlays/setCurrentItem',
      enterDrawMode: 'enterDrawMode',
      drawMode: 'drawMode',
      setDraw: 'setDraw',
      applyChange: 'changes/applyChange',
      saveFeature: 'features/saveFeature',
      updateSelectedFeature: 'updateSelectedFeature',
      updateDrawMode: 'updateDrawMode',
      cloneFeature: 'cloneFeature',
      mergeSelectedFeatures: 'mergeSelectedFeatures',
      addGeometryToFeature: 'addGeometryToFeature',
      splitMultifeature: 'splitMultifeature',
      updateSnapStatus: 'updateSnapStatus',
      updateSnapPoint: 'updateSnapPoint',
      updateFeatureBeingDrawn: 'updateFeatureBeingDrawn',
      pushGeometryBeingDrawPoint: 'pushGeometryBeingDrawPoint'
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
    /** 
     TODO:
    This handles 'in progress state' and it needs to be simplified. In progress drawing should be handled somewhere else, an option would be
    extend the Mapbox component API to emmit such events...
    */
    handleMapClick(map, e) {
      if (!this.isGeometryBeingDrawn) return;

      const clickPointLocation =
        this.snapPoint !== null
          ? this.snapPoint.coordinates
          : [e.lngLat.lng, e.lngLat.lat];

      const featureBeingDrawn = this.featureBeingDrawn.addCoordinate(
        clickPointLocation
      );

      this.updateFeatureBeingDrawn(featureBeingDrawn);

      const geometryType = this.geometryBeingDrawnType;

      this.createTooltip(`Click to continue drawing ${geometryType}`);

      const changeAction = {
        type: 'draw.step',
        features: [
          {
            type: geometryType,
            coordinates: clickPointLocation
          }
        ]
      };

      this.applyChange(changeAction);
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
            data: snapPoints
          },
          layout: {},
          paint: {
            'circle-radius': 5,
            'circle-color': '#007cbf'
          }
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
    handleSelectionchange(e) {
      let { features } = e;

      if (this.drawMode === 'add_multipart_feature') {
        switch (this.geometryAddingState) {
          case 'before_drawing':
            this.geometryAddingState = 'drawing';
            return;
            break;
          case 'drawing':
            this.geometryAddingState = 'after_drawing';

            this.handleAddGeometryToFeature(
              this.geometryAddingState,
              this.selectedFeature,
              [this.featureBeingDrawn.feature]
            );
            return;
          default:
            break;
        }
        return;
      }

      /**
       * After splitting, draw is calling 'selection change',
       * so here we will handle the splitting state updating.
       */
      if (this.drawMode === 'split_multipart_feature') {
        switch (this.featureSplittingStep) {
          case 'before_splitting':
            this.featureSplittingStep = 'after_splitting';
            break;
          case 'after_splitting':
            /**
             * Selection change after splitting means that the feature to
             * keep is already selected. So we will call handleSplitMultifeature
             * again with the new state.
             */
            const featureSplited = features[0];

            this.handleSplitMultifeature(
              this.featureSplittingStep,
              this.featureBeingSplitted,
              this.multiselectedFeatures,
              featureSplited
            );
            return;
            break;
          default:
            break;
        }
      }

      this.updateSelectedFeature(features);

      if (features[0]) {
        const updateFeatureAction = {
          ...e
        };

        this.applyChange(e);
      }
    },
    handleModechange(e) {
      // /**
      //  *  autochange mode is actualy necessary? yes.
      //  */
      const mode = this.drawMode;
      if (mode === 'split_multipart_feature') return;
      if (mode === 'add_multipart_feature') return;
      this.updateDrawMode(e.mode);
    },
    handleAddNewFeature() {
      const activeLayerType = this.activeLayer.geometry;
      switch (activeLayerType) {
        case 'point':
          this.createTooltip({ content: 'Click to add point' });
          this.enterDrawMode('draw_point');
          break;
        case 'line':
          this.createTooltip({ content: 'Click to start drawing line' });
          this.enterDrawMode('draw_line_string');
          break;
        case 'polygon':
          this.createTooltip({ content: 'Click to start drawing polygon' });
          this.enterDrawMode('draw_polygon');
          break;
        default:
          break;
      }
    },

    handleDrawCreate(e) {
      if (this.tippy[0]) {
        this.tippy[0].destroy();
        this.tippy = [];
      }
      if (this.drawMode === 'add_multipart_feature') return; //the creation will be handled by the handleAddGeometryToFeature
      this.applyChange(e);
    },
    handleDrawUpdate(e) {
      this.applyChange(e);
    },
    handleDrawDelete(e) {
      this.applyChange(e);
    },
    handleMouseOverPoint(point) {
      console.log('mouse over point: ', point);

      this.updateSnapPoint(point);
      if (this.tippy[0]) {
        this.createTooltip({
          content: 'Click again to finish drawing'
        });
      }
    },
    handleCloneFeature() {
      this.cloneFeature(this.selectedFeature);
    },
    async handleMergeSelectedFeatures() {
      const newFeature = await mergeFeatures(
        this.selectedFeature,
        this.multiselectedFeatures
      );

      const updateFeatureAction = {
        features: [newFeature],
        type: 'draw.update',
        action: 'features.merge'
      };

      this.updateDrawMode('simple_select');
      this.applyChange(updateFeatureAction);
    },
    async handleAddGeometryToFeature(
      geometryAddingState,
      baseFeature,
      newGeometryToAdd
    ) {
      switch (geometryAddingState) {
        case 'before_drawing':
          this.updateDrawMode('add_multipart_feature');
          this.addGeometryToFeature();

          const geometryType =
            this.selectedFeature.geometry.type === 'MultiLineString'
              ? 'LineString'
              : this.selectedFeature.geometry.type === 'MultiPolygon'
              ? 'Polygon'
              : 'Point';

          const newFeatureBeingDrawn = new Feature(
            this.selectedFeature.id,
            geometryType,
            {}
          );

          this.updateFeatureBeingDrawn(newFeatureBeingDrawn);

          return;
          break;
        case 'after_drawing':
          const newFeature = await this.featureBeingDrawn.mergeFeature(
            baseFeature
          );

          // TODO: ta rolando uma corrida aqui...

          this.updateDrawMode('simple_select');
          console.log('antes de deletar');
          this.draw.delete(baseFeature.id);
          console.log('antes de add');

          this.draw.add(newFeature);
          console.log('antes de mudar o modo');

          this.draw.changeMode('simple_select', {
            featureIds: [newFeature.id]
          });

          /**
           * TODO,
           * para a feature ser deletada eu preciso do id da feature que foi usada pra fazer essa feature, entretanto, em algum lugar,
           * eu estou sobre escrevendo o id original pelo id da feature selecionada. O que é bom na hora de criar a feature, mas nao tão bom
           * quando eu preciso fazer coisas genéricas. Considerar se isso deve mudar, ou se há outra maneira
          // this.draw.delete(newGeometryToAdd[0].id);
           *
            O snap funciona da seguinte maneira:
            o aplicativo cria pontos de apoio, quando o mouse esta sobre esses pontos o aplicativo atualiza seu status e salva a localização desse ponto.
            ao criar ua nova feature todos os clicks são salvos e, caso o mouse esteja em cima de um ponto de apoio a localização do ponto de apoio é usada.
            
            Depois que o estado de desenho é finalizado o aplicativo vai desenhar uma nova feature usando os pontos que foram coletados.

            Ou seja o snap é a soma de 4 sistemas:
            - marcar pontos de apoio no mapa 
            - salvar a posição do mouse quando esse estiver sobre um ponto de apoio
            - quando em estado de desenho, salvar cada ponto de apoio usado para gerar a geometria e desenhar uma geometria nova com esses
            esses pontos.
            - ao finalizar o desenho apagar a geometria antiga e desenhar a nova.

            algumas questões:
            -Desenhar pontos de apoio é uma boa? Eles vão precisar ser atualizados.. 
            eu podia ao invés desenhar somente o ponto que o mouse está em cima.
            - Estou sentindo falta de uma maneira de dizer que o mouse está em cima de uma ponto... talvez eu tenha que desenhar um ponto
            que o mouse esteja em cima.
            - O sistema de desenho tá meio confuso... Eu posso talvez generalizar ele, criar uma grande função que desenha a geometria.
            Acontece que agora eu desenho a geometria usando o draw, mas tenho que apagar e redesenhar. Talvez isso pudesse ser uma função.
            Um objeto, talvez. Que gere a geometria e que tambem exponha sua API, caso eu queria mais controle.
           */

          //TODO: eu tenho que salvar a feature com o snap

          console.log('antes de change selection');

          this.handleSelectionchange({ features: [newFeature] });
          console.log('antes de applychange');

          const updateFeatureAction = {
            features: [newFeature],
            type: 'draw.update',
            action: 'features.merge'
          };

          this.applyChange(updateFeatureAction);

          this.geometryAddingState = 'before_drawing';
          break;
        default:
          break;
      }
    },
    async handleSplitMultifeature(
      splitState,
      featureBeingSplitted,
      featureBeingSplittedParts,
      splittedFeature
    ) {
      switch (splitState) {
        case 'before_splitting':
          this.featureBeingSplitted = featureBeingSplitted;

          // this function calls draw.uncombineFeatures(),
          // witch split the selected feature.
          // After the splitting draw will call 'selection change'.
          this.splitMultifeature();
          break;
        case 'after_splitting':
          //filter out the selected feature
          const featureBeingSplittedNewParts = featureBeingSplittedParts.filter(
            feature => {
              return feature.id !== splittedFeature.id;
            }
          );

          const baseFeature = {
            id: featureBeingSplitted.id,
            type: featureBeingSplitted.type,
            properties: featureBeingSplitted.properties,
            geometry: featureBeingSplittedNewParts[0].geometry
          };

          const updatedFeatureBeingSplitted = await mergeFeatures(
            baseFeature,
            featureBeingSplittedNewParts
          );

          const updateFeatureAction = {
            features: [updatedFeatureBeingSplitted],
            type: 'draw.update',
            action: 'features.merge'
          };

          this.applyChange(updateFeatureAction);

          this.updateDrawMode('simple_select');

          this.draw.delete(splittedFeature.id);
          featureBeingSplittedParts.map(feature => {
            this.draw.delete(feature.id);
          });
          this.handleSelectionchange({ features: [splittedFeature] });

          this.cloneFeature(splittedFeature);

          this.featureSplittingStep = 'before_splitting';
        default:
          break;
      }
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
        plugins: [followCursor]
      });
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