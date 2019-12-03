export default {
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
                ['==', 'user_approved', false]
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
                ['==', 'user_approved', false]
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
                ['==', 'user_approved', false]
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
                ['==', 'user_approved', false]
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
} 