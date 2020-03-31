import union from '@turf/union';
import { featureCollection } from '@turf/helpers';
import combine from '@turf/combine';
import explode from '@turf/explode';

const Feature = class {
  constructor(id, geometryType, properties) {
    this.id = id;
    this.properties = properties;
    this._geometryType = geometryType;
    this._coordinatePoints = [];
  }

  addCoordinate(coordinate) {
    this._coordinatePoints.push(coordinate);
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
              return point.coordinates;
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
            return point.coordinates;
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
