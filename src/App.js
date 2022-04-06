import React, { useState, useEffect } from "react";
import Papa from 'papaparse';
import proj4 from 'proj4'
import Map from "./Map";
import { Layers, TileLayer, VectorLayer } from "./Layers";
// import { Style, Icon } from "ol/style";
// import Feature from "ol/Feature";
// import Point from "ol/geom/Point";
import { osm, vector } from "./Source";
import { fromLonLat, get } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import { Controls, FullScreenControl } from "./Controls";
import FeatureStyles from "./Features/Styles";
import Table from "./Components/Table";
import LayerControl from "./Components/LayerControl";
import SelectDropDown from "./Components/SelectDropDown";

import config from "./config.json";
import CheckPointsInsidePolygon from "./Functions/Inside";
import CSVtoGeoJSON from "./Functions/CSVtoGeoJSON";
import Centroid from "./Functions/Centroid";
import "./tailwind.generated.css";

const zone = config.zone
proj4.defs([
  [`MGA94`, `+proj=utm +zone=${zone} +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs`],
  ['EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs']
]);

const App = () => {
  //// map controls
  const [zoom, setZoom] = useState(config.zoom)
  const [center, setCenter] = useState(config.center)

  //// layer data and controls
  const [showLayer1, setShowLayer1] = useState(true);
  const [outerboundary_fn, setOuterboundary_fn] = useState(config.outerboundary[0]);
  const [outerboundary, setOuterboundary] = useState(null);

  const [showLayer2, setShowLayer2] = useState(true);
  const [points_fn, setPoints_fn] = useState(config.GCPs);
  const [points, setPoints] = useState(null);

  //// table data
  const [pointsInside, setPointsInside] = useState(null)

  //// get GCPs csv and transform to GeoJSON for the map
  useEffect(() => {
    fetch(points_fn)
      .then(response => response.text())
      .then((data) => {
        Papa.parse(data, {
          delimiter: ",",
          header: true,
          dynamicTyping: true,
          transformHeader: h => h.trim(),
          complete: results => {
            const outGeoJson = CSVtoGeoJSON(results.data, { 'from': `MGA94`, 'to': 'EPSG:4326' })
            setPoints(outGeoJson)
          },
        });
      });
  }, [points_fn]);

  //// get outerboundary geojson
  useEffect(() => {
    fetch(outerboundary_fn, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
      .then((data) => {
        //// set polygon
        setOuterboundary(data)

        //// set map to the polygon
        const centroid = Centroid(data.features[0].geometry.coordinates[0])
        setCenter(centroid)
        setZoom(16)
      });
  }, [outerboundary_fn])

  //// CALCULATE IF INSIDE
  useEffect(() => {
    if (points && outerboundary) {
      const innerPoints = CheckPointsInsidePolygon(points, outerboundary)
      setPointsInside(innerPoints)

    }
  }, [outerboundary, points])


  const handleOuterboundaryChange = (o) => {
    setOuterboundary_fn(o)
    setShowLayer1(false)
    setShowLayer2(false)
  }
  return (
    <div className="flex flex-row">
      <div className="basis-1/4 m-2.5">
        <div>
          {pointsInside && (
            <Table data={pointsInside} />)
          }
        </div>
      </div>

      <div className="basis-3/4 relative">
        <Map center={fromLonLat(center)} zoom={zoom} >
          <Layers>
            <TileLayer source={osm()} zIndex={0} />

            {(showLayer1 && outerboundary !== null) && (
              <VectorLayer
                source={vector({
                  features: new GeoJSON().readFeatures(outerboundary, {
                    featureProjection: get("EPSG:3857"),
                  }),
                })}
                style={FeatureStyles.MultiPolygon}
              />
            )}
            {(showLayer2 && pointsInside !== null) && (
              <VectorLayer
                source={vector({
                  features: new GeoJSON().readFeatures(pointsInside, {
                    featureProjection: get("EPSG:3857"),
                  }),
                })}
                style={FeatureStyles.PointFeatured}
              />
            )}
          </Layers>
          <Controls>
            <FullScreenControl />
          </Controls>
        </Map>

        <div className="pb-1 absolute bottom-5 right-5">

        </div>
        <div>
          <LayerControl
            label="Outerboundary"
            checked={showLayer1}
            onChange={(event) => setShowLayer1(event.target.checked)}
          >
          </LayerControl>

          <LayerControl
            label="Control Points"
            checked={showLayer2}
            onChange={(event) => setShowLayer2(event.target.checked)}
          >
          </LayerControl>
          <SelectDropDown options={config.outerboundary} handler={handleOuterboundaryChange} />
          <p className="inline-block pl-10">{outerboundary_fn}</p>
        </div>
      </div>
    </div>


  );
};

export default App;
