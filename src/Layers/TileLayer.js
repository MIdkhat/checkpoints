import { useContext, useEffect, useRef } from "react";
import MapContext from "../Map/MapContext";
import OLTileLayer from "ol/layer/Tile";

const TileLayer = ({ source, zIndex = 0 }) => {
	const layerRef = useRef(false);
	const { map } = useContext(MapContext);

	useEffect(() => {
		if (!map) return;

		if (!layerRef.current) {
			let tileLayer = new OLTileLayer({
				source,
				zIndex,
			});
	
			map.addLayer(tileLayer);
			tileLayer.setZIndex(zIndex);
			layerRef.current = true;

			return () => {
				if (map) {
					map.removeLayer(tileLayer);
				}
			};
		}
	// eslint-disable-next-line
	}, [map]);

	return null;
};

export default TileLayer;
