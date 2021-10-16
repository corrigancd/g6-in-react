export class MapHelper {
  getCoords = () => this.nodes.map((node) => node.getModel().map);
  getLatLngs = () => this.coords.map((coord) => L.latLng(coord));
  setMap = (map) => (this.leafletMap = map);

  constructor(props) {
    this.nodes = props.nodes;
    this.coords = this.getCoords();
    this.latLngs = this.getLatLngs();
  }

  getCenter = () => {
    const getAvg = (type) => {
      const sum = this.coords.reduce((total, value) => total + value[type], 0);
      return sum / this.nodes.length;
    };
    return [getAvg("lat"), getAvg("lon")];
  };

  fitBounds = () => this.leafletMap.fitBounds(this.latLngs);
}
