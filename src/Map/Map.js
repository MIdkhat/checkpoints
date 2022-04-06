import React, { useRef, useState, useEffect } from "react"
import "./Map.css";
import MapContext from "./MapContext";
import * as ol from "ol";

const Map = ({ children, zoom, center }) => {
	const mapRef = useRef();
	const [map, setMap] = useState(null);

	//// on component mount
	useEffect(() => {
		let options = {
			view: new ol.View({ center, zoom }),
			layers: [],
			controls: [],
			overlays: []
		};

		let mapObject = new ol.Map(options);
		mapObject.setTarget(mapRef.current);
		setMap(mapObject);

		return () => mapObject.setTarget(undefined);
		// eslint-disable-next-line
	}, []);

	//// zoom change handler
	useEffect(() => {
		if (!map) return;

		// map.getView().setZoom(zoom);
		map.getView().animate({
			zoom: zoom,
			duration: 2000,
		})
		// eslint-disable-next-line
	}, [zoom]);

	//// center change handler
	useEffect(() => {
		if (!map) return;

		if (center) { 
			// map.getView().setCenter(center) 
			map.getView().animate({
				center: center,
				duration: 2000,
			})
		}
		// eslint-disable-next-line
	}, [center])

	return (
		<MapContext.Provider value={{ map }}>
			<div ref={mapRef} className="ol-map">
				{children}
			</div>
		</MapContext.Provider>
	)
}

export default Map;