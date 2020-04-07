import union from '@turf/union';
import { featureCollection } from '@turf/helpers';
import combine from '@turf/combine';
import explode from '@turf/explode';

import { mergeFeatures } from './Helpers';

const Feature = class {
  constructor(id, geometryType, properties, isLocked) {
    this.id = id;
    this.properties = properties;
    this._geometryType = geometryType;
    this._coordinatePoints = [];
    this.isLocked = isLocked;
  }

  addCoordinate(coordinate) {
    let newFeature = new Feature(
      this.id,
      this._geometryType,
      this.properties,
      this.isLocked
    );

    if (!this.isLocked) {
      newFeature._coordinatePoints = [...this.coordinatePoints, coordinate];
    } else {
      newFeature._coordinatePoints = [...this.coordinatePoints];
    }
    return newFeature;
  }

  lockDrawing() {
    let newFeature = new Feature(
      this.id,
      this._geometryType,
      this.properties,
      this.isLocked
    );

    newFeature._coordinatePoints = [...this.coordinatePoints];
    newFeature.isLocked = true;
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
