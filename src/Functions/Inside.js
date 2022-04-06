
import proj4 from 'proj4'
import config from "../config.json";
const zone = config.zone
proj4.defs([
    [`MGA94`, `+proj=utm +zone=${zone} +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs`],
    ['EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs']
]);

export default function CheckPointsInsidePolygon(points, polygon){
      //// transform polygon coords to MGA94
      const feature = polygon.features[0]
      const polygon_coords = feature.geometry.coordinates[0].map(function (f) {
        const coords = proj4.transform(
          new proj4.Proj('EPSG:4326'),
          new proj4.Proj(`MGA94`),
          f
        )
        return coords
      })
      points.features.forEach(function (f){
        //// transform points coords to MGA94
        const point_coords = proj4.transform(
            new proj4.Proj('EPSG:4326'),
            new proj4.Proj(`MGA94`),
            f.geometry.coordinates
  
          )
          f.properties.inside = inside(point_coords, polygon_coords)

      })
    return points
}

function inside(point, vs) {
    // ray-casting algorithm based on
    // https://en.wikipedia.org/wiki/Point_in_polygon
    // If the point is on the outside of the polygon the ray will intersect 
    // its edge an even number of times. If the point is on the inside of 
    // the polygon then it will intersect the edge an odd number of times
  
    let x = point.x, y = point.y;
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      let xi = vs[i].x, yi = vs[i].y;
      let xj = vs[j].x, yj = vs[j].y;
  
      //// check if ray intersects side
      let intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi) / (yj - yi) + xi));
      if (intersect) inside = !inside;
    }
  
    return inside;
  };