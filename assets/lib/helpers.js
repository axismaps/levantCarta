import union from '@turf/union';
import { featureCollection } from '@turf/helpers';
import combine from '@turf/combine';
import explode from '@turf/explode';
import uuidv4 from 'uuid/v4';

const mergeFeatures = function(baseFeature, featureParts) {
  let newGeometry = {};

  switch (baseFeature.geometry.type) {
    case 'Polygon':
    case 'MultiPolygon':
      let polygonsToUnion = [baseFeature, ...featureParts];

      while (polygonsToUnion.length > 1) {
        const args = polygonsToUnion.splice(0, 2);
        polygonsToUnion.unshift(union(...args));
      }

      newGeometry = polygonsToUnion[0].geometry;

      break;
    case 'LineString':
    case 'MultiLineString':
      newGeometry = combine(featureCollection([baseFeature, ...featureParts]))
        .features[0].geometry;

      break;
    case 'Point':
    case 'MultiPoint':
      newGeometry = combine(featureCollection([baseFeature, ...featureParts]))
        .features[0].geometry;

      break;
    default:
      break;
  }

  return {
    id: baseFeature.id,
    properties: baseFeature.properties,
    type: 'Feature',
    geometry: newGeometry
  };
};

const featuresToPoints = function(features) {
  let points = explode(features);

  for (let i = 0; i < points.features.length; i++) {
    points.features[i].properties = {
      id: uuidv4()
    };
  }

  return points;
};

/**
 * Points to feature
 * @param {Array>} points
 * @param {Object} baseFeature
 */

const pointsToFeature = function(points, baseFeature) {
  const {
    geometry: { type }
  } = baseFeature;

  if (points.length === 0) return baseFeature;

  let geometry = [];
  if (type === 'Polygon' || type === 'MultiPolygon') {
    geometry = {
      type: type,
      coordinates: [
        points
          .slice()
          .reverse()
          .map(point => {
            return point.coordinates;
          })
      ]
    };

    geometry.coordinates[0].push(geometry.coordinates[0][0]); // closes the LinearRing
  } else if (type === 'LineString' || type === 'MultiLineString') {
    geometry = {
      type: 'LineString',
      coordinates: points
        .slice()
        .reverse()
        .map(point => {
          return point.coordinates;
        })
    };
  }

  return {
    id: baseFeature.id,
    type: 'Feature',
    properties: {
      approved: false,
      firstyear: baseFeature.properties.firstyear,
      lastyear: baseFeature.properties.lastyear,
      type: baseFeature.properties.type,
      tags: baseFeature.properties.tags
    },
    geometry: geometry
  };
};

export { mergeFeatures, featuresToPoints, pointsToFeature };
