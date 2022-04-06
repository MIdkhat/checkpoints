import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

export default {
  Point: new Style({
    image: new CircleStyle({
      radius: 1,
      stroke: new Stroke({
        color: "magenta",
      }),
      fill: new Fill({
        color: "magenta",
      }),
    }),
  }),
  Polygon: new Style({
    stroke: new Stroke({
      color: "blue",
      lineDash: [4],
      width: 3,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),
  MultiPolygon: new Style({
    stroke: new Stroke({
      color: "blue",
      width: 1,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),
  PointFeatured: function styleFunction(feature, resolution){
    const color = feature.get('inside') ? 'green' : 'red'
    return new Style({
      image: new CircleStyle({
        radius: 2,
        stroke: new Stroke({
          color: color,
        }),
        fill: new Fill({
          color: color,
        }),
      }),
    })
  }
};
