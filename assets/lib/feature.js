import union from '@turf/union';
import { featureCollection } from '@turf/helpers';
import combine from '@turf/combine';
import explode from '@turf/explode';

import { mergeFeatures } from './helpers';

const Feature = class {
  constructor(id, geometryType, properties) {
    this.id = id;
    this.properties = properties;
    this._geometryType = geometryType;
    this._coordinatePoints = [];
  }

  addCoordinate(coordinate) {
    const newFeature = new Feature(
      this.id,
      this._geometryType,
      this.properties
    );

    newFeature._coordinatePoints = [...this.coordinatePoints, coordinate];
    return newFeature;
  }

  mergeFeature(feature) {
    return mergeFeatures(feature, [this.feature]);
  }

  get coordinatePoints() {
    return this._coordinatePoints;
  }

  get feature() {
    const geometry = {
      type: this._geometryType
    };
    const points = this._coordinatePoints;

    switch (this._geometryType) {
      case 'Polygon':
      case 'MultiPolygon':
        geometry.coordinates = [
          points
            .slice()
            .reverse()
            .map(point => {
              return point;
            })
        ];

        geometry.coordinates[0].push(geometry.coordinates[0][0]); // closes the LinearRing
        break;
      case 'LineString':
      case 'MultiLineString':
        geometry.coordinates = points
          .slice()
          .reverse()
          .map(point => {
            return point;
          });
      default:
        break;
    }

    return {
      id: this.id,
      type: 'Feature',
      properties: this.properties,
      geometry: geometry
    };
  }
};

export { Feature };
