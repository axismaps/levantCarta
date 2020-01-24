import union from '@turf/union';
import { featureCollection } from '@turf/helpers';
import combine from '@turf/combine';
import explode from "@turf/explode";
import uuidv4 from 'uuid/v4';


const mergeFeatures = function (baseFeature, featureParts) {
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

const featuresToPoints = function (features) {

    let points = explode(features)

    for (let i = 0; i < points.features.length; i++) {
        points.features[i].properties = {
            id: uuidv4()
        }
    }

    return points
}


export { mergeFeatures, featuresToPoints }