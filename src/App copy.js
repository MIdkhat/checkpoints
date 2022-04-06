import React, { useState, useEffect } from "react";
import Map from "./Map";
import { Layers, TileLayer, VectorLayer } from "./Layers";
import { Style, Icon } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { osm, vector } from "./Source";
import { fromLonLat, get } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import { Controls, FullScreenControl } from "./Controls";
import FeatureStyles from "./Features/Styles";

import mapConfig from "./config.json";


const outerboundary_fn = mapConfig.outerboundary;



function addMarkers(lonLatArray) {
  var iconStyle = new Style({
    image: new Icon({
      anchorXUnits: "fraction",
      anchorYUnits: "pixels",
      src: mapConfig.markerImage32,
    }),
  });
  let features = lonLatArray.map((item) => {
    let feature = new Feature({
      geometry: new Point(fromLonLat(item)),
    });
    feature.setStyle(iconStyle);
    return feature;
  });
  return features;
}

const App = () => {
  const [center, setCenter] = useState(mapConfig.center);
  const [zoom, setZoom] = useState(9);

  const [showLayer1, setShowLayer1] = useState(true);
  const [showLayer2, setShowLayer2] = useState(true);
  const [showMarker, setShowMarker] = useState(false);
  // const [outerboundaryObject, setOureboundary] = useState({});
  const [outerboundaryObject, setOuterboundary] = useState({});

  // const [features, setFeatures] = useState(addMarkers(markersLonLat));

    useEffect(() => {
      fetch(outerboundary_fn)
      .then(response => {
        return response.json();
      })
      .then((jsondata) => {
        console.log(jsondata)
        setOuterboundary (jsondata)

      });
    }, []);


  return (
    <div>
      <Map center={fromLonLat(center)} zoom={zoom}>
        <Layers>
          <TileLayer source={osm()} zIndex={0} />

          {showLayer1 && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(outerboundaryObject, {
                  featureProjection: get("EPSG:3857"),
                }),
              })}
              style={FeatureStyles.MultiPolygon}
            />
          )}

          {/* {showMarker && 
            <VectorLayer source={vector({ features })} />
          } */}
        </Layers>
        <Controls>
          <FullScreenControl />
        </Controls>
      </Map>
      <div>
        <input
          type="checkbox"
          checked={showLayer1}
          onChange={(event) => setShowLayer1(event.target.checked)}
        />{" "}
        Outboundary
      </div>

      {/* <div>
        <input
          type="checkbox"
          checked={showMarker}
          // onChange={(event) => setShowMarker(event.target.checked)}
        />{" "}
        GCPs
      </div> */}
    </div>
  );
};

export default App;
