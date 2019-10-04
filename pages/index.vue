<template>
  <div>
    <the-header /> 
    <the-sidebar />
    <the-toolbox v-on:draw-init="handleDrawInit" />
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
import Mapbox from '~/components/Mapbox.vue';
import TheToolbox from '~/components/TheToolbox';
import TheHeader from '~/components/TheHeader';
import TheSidebar from '~/components/TheSidebar';

export default {
  components: {
    Mapbox,
    TheToolbox,
    TheHeader,
    TheSidebar
  },
  data() {
    return {
      map: null,
      draw: null
    };
  },
  methods: {
    handleMapInit(map) {
      console.log('Here is the map:', map);
      this.map = map;
      map.addControl(this.draw, 'top-left');

      // this.$store.commit('newMap', map);
    },
    handleDrawInit(draw) {
      console.log('Here is the draw instance', draw);

      this.draw = draw;
    }
  }
};
</script>

<style>
.map {
  margin-top: 60px;
}
.mapboxgl-ctrl-top-left {
  top: 0;
  left: 330px;
}
</style>
