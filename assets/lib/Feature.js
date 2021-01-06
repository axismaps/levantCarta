import union from '@turf/union';
import { featureCollection } from '@turf/helpers';
import combine from '@turf/combine';
import explode from '@turf/explode';

/**
 * This class is responsible for managing the feature creation process.
 * This class is necessary because we need to handle the snap system, and for that
 * we use this class to keep track of the snap points.
 * After the drawing is finished we call meargeFeature with the original feature from mapbox.draw
 * as the base feature and this class will merge the "snaped" geometry
 * with the base feature properties and id returning a new feature.
 *
 * OBS: This returns a new object without modifying the original one to be inline with vuex.
 */

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
