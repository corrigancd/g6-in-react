import React from "react";
import ReactDOM from "react-dom";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/images/marker-icon.png";
import { MapContainer, Marker, TileLayer, Popup, useMap } from "react-leaflet";
import { MapHelper } from "./map_helper";
import { GraphMapEventLinker } from "./graph_map_event_linker";


class Map {
	constructor(props, container) {
		this.props = props;
		this.container = container;
		this.helper = new MapHelper(props);
		this.linker = new GraphMapEventLinker({ graph: props.graph });
	}

	createMap() {
		const SetLeafletMap = () => {
			const leafletMap = useMap();
			this.helper.setMap(leafletMap);
			this.linker.setMap(leafletMap);
			this.linker.fitBounds();
			setTimeout(() => {
        console.log('here');
				this.linker.setNodePositions();
			}, 500);
			return null;
		};

		const renderLayerFromNodes = () => {
			return this.helper.createLayerFromModel();
		};

		ReactDOM.render(
			<MapContainer
				center={this.helper.getCenter()}
				zoom={1}
				scrollWheelZoom={true}
				style={{ height: `${this.props.graph.getHeight()}px` }}
			>
				<SetLeafletMap />
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
				{renderLayerFromNodes()}
			</MapContainer>,
			this.container
		);
	}
}

let map;
const getMap = (props, container) => {
	map = new Map(props, container);
	map.createMap();
	return map;
};

export { getMap };
