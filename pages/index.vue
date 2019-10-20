<template>
  <div class="container">
    <the-header class="header" />
    <div class="sidebar">
      <the-sidebar v-show="showSidebar" @addNewFeature="handleAddNewFeature" />
      <the-toolbox
        class="toolbox"
        :showSidebar="showSidebar"
        v-on:draw-init="handleDrawInit"
        v-on:toggle-sidebar="handleTogglesidebar"
      />
    </div>
    <mapbox
      :map-options="{
        style: 'https://maps.tilehosting.com/styles/basic/style.json?key=2rATmtGk6Jy8BQXXdDMD',
        style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json',
        center: [-43.181587010622025, -22.905508179548036],
        zoom: 11,
        }"
      :geolocate-control="{
        show: true,
        position: 'top-right'
        }"
      v-on:map-init="handleMapInit"
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
import { log } from 'util';

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
      draw: null
    };
  },
  async fetch(context) {
    const { data } = await axios.get('/data/layers.json');
    context.store.dispatch('layers/setItems', data);
  },
  computed: {
    ...mapGetters({
      layers: 'layers/items',
      activeLayer: 'layers/currentItem'
    })
  },
  methods: {
    ...mapActions('layers', ['setItems']),
    handleMapInit(map) {
      console.log('Here is the map:', map);
      this.map = map;
      map.addControl(this.draw);

      // this.$store.commit('newMap', map);
    },
    handleDrawInit(draw) {
      console.log('Here is the draw instance', draw);
      this.draw = draw;
    },
    handleTogglesidebar() {
      this.showSidebar = !this.showSidebar;
    },
    handleAddNewFeature() {
      const activeLayerType = this.activeLayer.type;
      switch (activeLayerType) {
        case 'Point':
          console.log('draw point');
          this.draw.changeMode('draw_point');
          break;
        case 'LineString':
          this.draw.changeMode('draw_line_string');
          console.log('draw line');
          break;
        case 'Polygon':
          this.draw.changeMode('draw_polygon');
          console.log('draw polygon');
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