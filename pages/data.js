export const data = {
  nodes: [
    {
      id: "dublin",
      size: 50,
      label: "dublin",
      map: { lat: 53.35043697171206, lon: -6.288003 },
    },
    {
      id: "london",
      size: 30,
      label: "london",
      map: { lat: 51.67534496887436, lon: -0.12441202445440414 },
    },
    {
      id: "berlin",
      size: 30,
      label: "berlin",
      map: { lat: 52.59052852796379, lon: 13.3624020020988 },
    },
    {
      id: "madrid",
      size: 30,
      label: "madrid",
      map: { lat: 40.42021030981701, lon: -3.8180355512901896 },
    },
    {
      id: "athens",
      size: 30,
      label: "athens",
      map: { lat: 38.53720404833121, lon: 23.528342038955174 },
    },
    {
      id: "kyiv",
      size: 30,
      label: "kyiv",
      map: { lat: 50.46447371362845, lon: 30.42275710867442 },
    },
    {
      id: "bucharest",
      size: 15,
      label: "bucharest",
      map: { lat: 44.60552171165435, lon: 26.461951094885265 },
    },
    {
      id: "ankara",
      size: 15,
      label: "ankara",
      map: { lat: 40.08891891102969, lon: 32.938619532384955 },
    },
    {
      id: "marrakesh",
      size: 15,
      label: "marrakesh",
      map: { lat: 31.438306447803015, lon: -7.769091151689819 },
    },
    {
      id: "cairo",
      size: 15,
      label: "cairo",
      map: { lat: 30.498366199953775, lon: 30.990220293002054 },
    },
    {
      id: "muscat",
      size: 15,
      label: "muscat",
      map: { lat: 23.313479660542704, lon: 58.00428662952616 },
    },
    {
      id: "tehran",
      size: 15,
      label: "tehran",
      map: { lat: 36.0375173296849, lon: 51.362030862134375 },
    },
    {
      id: "baku",
      size: 15,
      label: "baku",
      map: { lat: 40.352190246569236, lon: 49.81826791664389 },
    },
    {
      id: "moscow",
      size: 15,
      label: "moscow",
      map: { lat: 56.04287407364296, lon: 37.46816501487794 },
    },
    {
      id: "helsinki",
      size: 15,
      label: "helsinki",
      map: { lat: 60.26146718961772, lon: 24.830850298898554 },
    },
    {
      id: "stockholm",
      size: 15,
      label: "stockholm",
      map: { lat: 59.37714180677491, lon: 18.0813749495597 },
    },
    {
      id: "oslo",
      size: 15,
      label: "oslo",
      map: { lat: 60.10079643124693, lon: 10.542068401401929 },
    },
  ],
  edges: [
    { source: "dublin", target: "london" },
    { source: "dublin", target: "berlin" },
    { source: "dublin", target: "madrid" },
    { source: "dublin", target: "athens" },
    { source: "dublin", target: "oslo" },
    { source: "london", target: "bucharest" },
    { source: "london", target: "ankara" },
    { source: "berlin", target: "marrakesh" },
    { source: "berlin", target: "cairo" },
    { source: "berlin", target: "muscat" },
    { source: "berlin", target: "tehran" },
    { source: "berlin", target: "baku" },
    { source: "berlin", target: "madrid" },
    { source: "moscow", target: "helsinki" },
    { source: "moscow", target: "muscat" },
    { source: "moscow", target: "kyiv" },
  ],
};


export const sammpleGeoJson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        shape: 'Polygon',
        name: 'Germany Polygon',
        category: 'default',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              7.53521,
              47.620975,
            ],
            [
              8.546125,
              47.650588,
            ],
            [
              9.666921,
              47.546872,
            ],
            [
              10.28226,
              47.294134,
            ],
            [
              11.161316,
              47.457809,
            ],
            [
              12.589783,
              47.620975,
            ],
            [
              13.930343,
              48.647428,
            ],
            [
              12.084325,
              50.35948,
            ],
            [
              15.095092,
              51.069017,
            ],
            [
              13.95232,
              54.393352,
            ],
            [
              8.699959,
              54.939766,
            ],
            [
              9.227393,
              53.735716,
            ],
            [
              6.612201,
              53.839564,
            ],
            [
              6.700107,
              52.736292,
            ],
            [
              7.139635,
              52.281602,
            ],
            [
              6.062791,
              51.890054,
            ],
            [
              5.843027,
              51.041394,
            ],
            [
              6.150697,
              50.764259,
            ],
            [
              6.040815,
              50.303376,
            ],
            [
              6.370461,
              50.050085,
            ],
            [
              6.348484,
              49.567978,
            ],
            [
              6.656154,
              49.081062,
            ],
            [
              8.348337,
              48.936935,
            ],
            [
              7.53521,
              47.620975,
            ],
          ],
        ],
      },
      id: '92857ddb-c30c-43b8-a0eb-14265fdf3e57',
    },
  ],
};
