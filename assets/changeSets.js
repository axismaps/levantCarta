const changeSets = [
  {
    id: '67d892c4-409b-4556-b26f-3dcd8b79e63d',
    createAt: '2016-05-03',
    type: 'roads',
    approvedStatus: false,
    submittedBy: 'User',
    title: 'Edits to roads in the Ain El Mreiseh neighborhood',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    changes: [
      {
        id: 'd8edc3b4-c24e-4b2a-bd70-8847679e7a23',
        createAt: '2016-05-03',
        layer: 'Roads',
        approvedStatus: false,
        isSubmitted: false,
        submittedBy: 'User',
        comments: [],
        editType: 'edit',
        originalFeature: {
          type: 'Feature',
          id: 'GXcbtuM3',
          properties: {
            name: null,
            firstyear: 2015,
            lastyear: 8888,
            approved: null,
            tags: null,
            type: 'a779e64b-98f3-473d-8850-0aa5c38297ef'
          },
          geometry: {
            type: 'MultiLineString',
            coordinates: [
              [
                [35.5017171, 33.901118],
                [35.5004672, 33.901046],
                [35.4995144, 33.9009819],
                [35.4991368, 33.9009463],
                [35.49846754, 33.90091553]
              ]
            ]
          }
        },
        newFeature: {
          id: 'GXcbtuM3',
          type: 'Feature',
          properties: {
            name: null,
            firstyear: 2015,
            lastyear: 2020,
            approved: false,
            tags: null,
            type: 'a779e64b-98f3-473d-8850-0aa5c38297ef'
          },
          geometry: {
            coordinates: [
              [
                [35.5017171, 33.901118],
                [35.5004672, 33.901046],
                [35.4995144, 33.9009819],
                [35.4991368, 33.9009463],
                [35.49846754, 33.90091553]
              ]
            ],
            type: 'MultiLineString'
          }
        }
      },
      {
        id: '22f5b1ab-55ab-4a9f-a5a5-fb5223e37e58',
        createAt: '2016-05-03',
        layer: 'Roads',
        approvedStatus: false,
        isSubmitted: false,
        submittedBy: 'User',
        comments: [],
        editType: 'edit',
        originalFeature: {
          type: 'Feature',
          id: 'hSX4ky7B',
          properties: {
            name: '57',
            firstyear: 2015,
            lastyear: 8888,
            approved: false,
            tags: '',
            type: 'b1877fa6-f0fd-44f0-a6b0-3d26c996f224'
          },
          geometry: {
            type: 'MultiLineString',
            coordinates: [
              [
                [35.5290359, 33.8950482],
                [35.5293936, 33.8949142],
                [35.5303665, 33.8947903]
              ],
              [[35.4995869, 33.9015303], [35.5001814913741, 33.90121283659828]],
              [[35.4814006, 33.893379], [35.4814607, 33.8939756]],
              [
                [35.5302275, 33.9022695],
                [35.5309328, 33.9020617],
                [35.5313894, 33.9019519],
                [35.5317477, 33.9018389]
              ]
            ]
          }
        },
        newFeature: {
          id: 'hSX4ky7B',
          type: 'Feature',
          properties: {
            name: '57',
            firstyear: 2015,
            lastyear: 2020,
            approved: false,
            tags: '',
            type: 'b1877fa6-f0fd-44f0-a6b0-3d26c996f224'
          },
          geometry: {
            coordinates: [
              [
                [35.5290359, 33.8950482],
                [35.5293936, 33.8949142],
                [35.5303665, 33.8947903]
              ],
              [
                [35.4995869, 33.9015303],
                [35.49958753144515, 33.90100812138389]
              ],
              [[35.4814006, 33.893379], [35.4814607, 33.8939756]],
              [
                [35.5302275, 33.9022695],
                [35.5309328, 33.9020617],
                [35.5313894, 33.9019519],
                [35.5317477, 33.9018389]
              ]
            ],
            type: 'MultiLineString'
          }
        }
      },
      {
        id: 'c891a31a-7c40-42cf-9565-0bd15072e70f',
        createAt: '2016-05-03',
        layer: 'Roads',
        approvedStatus: false,
        isSubmitted: false,
        submittedBy: 'User',
        comments: [],
        editType: 'edit',
        originalFeature: {
          type: 'Feature',
          id: 's75Hg3kJ',
          properties: {
            name: null,
            firstyear: 2015,
            lastyear: 8888,
            approved: null,
            tags: null,
            type: 'a779e64b-98f3-473d-8850-0aa5c38297ef'
          },
          geometry: {
            type: 'MultiLineString',
            coordinates: [
              [
                [35.4991846, 33.9002133],
                [35.499173, 33.9002885],
                [35.4991368, 33.9009463]
              ]
            ]
          }
        },
        newFeature: {
          id: 's75Hg3kJ',
          type: 'Feature',
          properties: {
            name: null,
            firstyear: 2015,
            lastyear: 8888,
            type: 'a779e64b-98f3-473d-8850-0aa5c38297ef',
            tags: null,
            approved: false
          },
          geometry: {
            coordinates: [
              [
                [35.4991846, 33.9002133],
                [35.499173, 33.9002885],
                [35.4991368, 33.9009463]
              ]
            ],
            type: 'MultiLineString'
          }
        }
      },
      {
        id: '7ad44a0a-6589-436f-b53e-300b1aecbaff',
        createAt: '2016-05-03',
        layer: 'Roads',
        approvedStatus: false,
        isSubmitted: false,
        submittedBy: 'User',
        comments: [],
        editType: 'edit',
        originalFeature: {
          type: 'Feature',
          id: 'dd0473c0-1a1b-4934-8de2-4c91ded9bfe1',
          properties: {
            name: 'the road',
            firstyear: 1900,
            lastyear: 2000,
            approved: false,
            tags: null,
            type: 'ba2101e5-eef5-4c2d-91d9-57903afa93e6'
          },
          geometry: {
            type: 'MultiLineString',
            coordinates: [
              [
                [35.49145544345049, 33.89839946098304],
                [35.49557531649728, 33.900429829908944],
                [35.50008142764247, 33.9006791701283],
                [35.499781020232405, 33.898043250924104],
                [35.49797857577491, 33.89743769040723]
              ]
            ]
          }
        },
        newFeature: {
          id: 'dd0473c0-1a1b-4934-8de2-4c91ded9bfe1',
          type: 'Feature',
          properties: {
            name: 'the road',
            firstyear: 1900,
            lastyear: 2000,
            type: 'ba2101e5-eef5-4c2d-91d9-57903afa93e6',
            tags: null,
            approved: false
          },
          geometry: {
            coordinates: [
              [
                [35.49145544345049, 33.89839946098304],
                [35.49557531649728, 33.900429829908944],
                [35.50008142764247, 33.9006791701283],
                [35.499781020232405, 33.898043250924104],
                [35.49797857577491, 33.89743769040723]
              ]
            ],
            type: 'MultiLineString'
          }
        }
      }
    ]
  }
];

export default changeSets;
