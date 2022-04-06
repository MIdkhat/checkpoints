
import proj4 from 'proj4'
import config from "../config.json";
const zone = config.zone
proj4.defs([
    [`MGA94`, `+proj=utm +zone=${zone} +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs`],
    ['EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs']
]);

export default function CSVtoGeoJSON(data, transform) {

    const features = data.map(function (f) {
        const coords = transform ?
            proj4.transform(
                // new proj4.Proj(`MGA94`),
                // new proj4.Proj('EPSG:4326'),
                new proj4.Proj(transform.from),
                new proj4.Proj(transform.to),
                [+f.Easting, +f.Northing]
            ) :
            { x: +f.Easting, y: +f.Northing }

        return {
            "type": "Feature",
            "properties": { "Name": f.Name, "description": "Point" },
            "geometry": {
                "type": "Point",
                "coordinates": [coords.x, coords.y]
            }
        }
    })

    return {
        "type": "FeatureCollection",
        "name": "GCPs",
        // "crs": {
        //   "type": "name",
        //   "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" }
        // },
        "features": features
    }

}