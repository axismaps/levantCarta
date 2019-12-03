import axios from 'axios';
const API = 'http://beirut.georio.levantcarta.org/api/v1/get/features/';

export const state = () => ({
    features: [],
    isLoading: false,
    currentFeatures: [],

})

export const mutations = {
    SET_FEATURES(state, features) {
        state.features.push(features)
    },
    UPDATE_CURRENT_FEATURES(state, features) {
        state.currentFeatures = features
    },

}

export const actions = {
    async setFeaturesFromLayer({ commit, state, rootState }, layerId) {

        let featureCollection = {}
        console.log(rootState)
        if (rootState.layers.loadedItems.includes(layerId)) {
            featureCollection = state.features.filter(layer => {
                console.log(layer)
                console.log(layerId)
                return layer.layerId === layerId
            })[0]
            commit('UPDATE_CURRENT_FEATURES', featureCollection)

            console.log('NO API', featureCollection)
        } else {
            const { data } = await axios.get('http://beirut.georio.levantcarta.org/api/v1/get/features/' + layerId);
            console.log('API')
            featureCollection = data
            commit('UPDATE_CURRENT_FEATURES', { ...data, layerId })
            commit('SET_FEATURES', { ...data, layerId })
            commit('layers/LOAD_LAYER', layerId, { root: true })
        }

        rootState.draw.deleteAll()
        rootState.draw.add(featureCollection)
    },
    async saveFeature({ }, feature) {

        const request = {
            type: feature.properties.type,
            dataType: 'geojson',
            data: {
                id: feature.id,
                properties: feature.properties,
                geometry: feature.geometry
            }
        }

        await axios.post('http://beirut.georio.levantcarta.org/api/v1/make/feature', request)

        console.log('saving feature: ', request)
    }
}

const _data = {
    "data": {
        "responseCode": 200,
        "responseMessage": "OK",
        "response": {
            "firstyear": 1935,
            "lastyear": 1940,
            "name": null,
            "tags": "tags",
            "approved": false,
            "id": "random-id",
            "geom": {
                "type": "MultiPolygon",
                "coordinates": [
                    [
                        [
                            [
                                35.52542158834564,
                                33.87618177166101
                            ],
                            [
                                35.52676337514657,
                                33.87398648736959
                            ],
                            [
                                35.52891418045971,
                                33.8747892471298
                            ],
                            [
                                35.52542158834564,
                                33.87618177166101
                            ]
                        ]
                    ]
                ]
            },
            "geom_merc": {
                "type": "MultiPolygon",
                "coordinates": [
                    [
                        [
                            [
                                3954671.841431004,
                                4012188.355703198
                            ],
                            [
                                3954821.2084544376,
                                4011894.014804172
                            ],
                            [
                                3955060.6350066913,
                                4012001.6469239825
                            ],
                            [
                                3954671.841431004,
                                4012188.355703198
                            ]
                        ]
                    ]
                ]
            },
            "updatedAt": "2019-12-03T19:59:07.416Z",
            "createdAt": "2019-12-03T19:59:07.377Z",
            "remoteId": null,
            "firstdate": null,
            "lastdate": null,
            "TypeId": "860651a7-2d8c-42bc-b993-beb37d0eea22"
        }
    },
    "status": 200,
    "statusText": "OK",
    "headers": {
        "content-type": "application/json; charset=utf-8"
    },
    "config": {
        "url": "http://beirut.georio.levantcarta.org/api/v1/make/feature",
        "method": "post",
        "data": "{\"type\":\"860651a7-2d8c-42bc-b993-beb37d0eea22\",\"dataType\":\"geojson\",\"data\":{\"id\":\"random-id\",\"properties\":{\"firstyear\":1935,\"lastyear\":1940,\"name\":null,\"tags\":\"tags\",\"approved\":\"false\"},\"geometry\":{\"type\":\"polygon\",\"coordinates\":[[[35.52542158834564,33.87618177166101],[35.52676337514657,33.87398648736959],[35.52891418045971,33.8747892471298],[35.52542158834564,33.87618177166101]]]}}}",
        "headers": {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json;charset=utf-8"
        },
        "transformRequest": [
            null
        ],
        "transformResponse": [
            null
        ],
        "timeout": 0,
        "xsrfCookieName": "XSRF-TOKEN",
        "xsrfHeaderName": "X-XSRF-TOKEN",
        "maxContentLength": -1
    },
    "request": {}
}