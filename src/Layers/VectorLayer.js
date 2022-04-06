import { useContext, useEffect, useRef } from "react";
import MapContext from "../Map/MapContext";
import OLVectorLayer from "ol/layer/Vector";

const VectorLayer = ({ source, style, zIndex = 0 }) => {
	const layerRef = useRef(false);
	const { map } = useContext(MapContext);

	useEffect(() => {
		if (!map) return;

		if (!layerRef.current) {
			let vectorLayer = new OLVectorLayer({
				source,
				style
			});

			map.addLayer(vectorLayer);
			vectorLayer.setZIndex(zIndex);
			layerRef.current = true;

			return () => {
				if (map) {
					map.removeLayer(vectorLayer);
				}
			};
		}
	// eslint-disable-next-line
	}, [map]);

	return null;
};

export default VectorLayer;