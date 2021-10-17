export class MapHelper {
  getCoords = (nodes) => nodes.map((node) => node.getModel().map);

  getLatLngs = (nodes) => {
    const coords = this.getCoords(nodes);
    return coords.map((coord) => L.latLng(coord));
  };

  setMap = (map) => (this.leafletMap = map);

  constructor({ graph }) {
    this.graph = graph;
    this.nodes = graph.getNodes();
    this.coords = this.getCoords(this.nodes);
    this.latLngs = this.getLatLngs(this.nodes);
  }

  getCenter = () => {
    const getAvg = (type) => {
      const sum = this.coords.reduce((total, value) => total + value[type], 0);
      return sum / this.nodes.length;
    };
    return [getAvg("lat"), getAvg("lon")];
  };

  enterMapMode = () => {
    const data = this.graph.save();
    const latLngs = this.getLatLngs(this.graph.getNodes());

    for (let i = 0; i < latLngs.length - 1; i++) {
      const latLng = this.latLngs[i];
      const containerPoint = this.leafletMap.latLngToContainerPoint(latLng);
      console.log(containerPoint);
      data.nodes[i].x = containerPoint.x;
      data.nodes[i].y = containerPoint.y;
    }

    this.graph.changeData(data);
  };

  fitBounds = (latLngs) => {
    const latLngsToUse = latLngs ? latLngs : this.latLngs;
    this.leafletMap.fitBounds(latLngsToUse);
  };
}
