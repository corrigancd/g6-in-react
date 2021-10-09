require("leaflet");
require('tilelayer-canvas');


console.log(L)
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const { Graph } = require('@antv/g6');
const _tslib = require("tslib");
const _createDom = _interopRequireDefault(require("@antv/dom-util/lib/create-dom"));
const _modifyCss = _interopRequireDefault(require("@antv/dom-util/lib/modify-css"));
const _base = _interopRequireDefault(require("@antv/g6/lib/plugins/base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 网格背景图片
const GRID_PNG = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UwZTBlMCIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=)';

const Grid =
  /** @class */
  function (_super) {
    (0, _tslib.__extends)(Grid, _super);

    function Grid(specs) {
      this.specs = specs;
      return _super !== null && _super.apply(this, arguments) || this;
    }

    Grid.prototype.getDefaultCfgs = function () {
      return {
        img: GRID_PNG
      };
    };

    Grid.prototype.init = function () {
      const graph = this.get('graph');
      const minZoom = graph.get('minZoom');
      const graphContainer = graph.get('container');
      const canvas = graph.get('canvas').get('el');
      const width = graph.get('width');
      const height = graph.get('height');

      console.log(height, width);
      const mapContainer = L.DomUtil.create('div');
      (0, _modifyCss.default)(mapContainer, {
        position: 'absolute',
        width: width + "px",
        height: height + "px",
        left: "0px",
        top: "0px",
        'z-index': -1
      });

      const map = L.map(mapContainer, {
        renderer: L.canvas(),
        preferCanvas: true
      }).setView([51.505, -0.09], 13);

      setTimeout(() => {
        map.invalidateSize();
      }, 0);

      const tileLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
      ]).addTo(map);

      console.log('getting nodes in grid ', graph.getNodes());


      // append the map before g6 canvas
      graphContainer.insertBefore(mapContainer, canvas);

    }; // class-methods-use-this


    Grid.prototype.getEvents = function () {
      return {
        viewportchange: 'updateGrid'
      };
    };
    /**
     * viewport change 事件的响应函数
     * @param param
     */


    Grid.prototype.updateGrid = function (param) {
      const gridContainer = this.get('gridContainer');
      const matrix = param.matrix;
      if (!matrix) matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
      const transform = "matrix(" + matrix[0] + ", " + matrix[1] + ", " + matrix[3] + ", " + matrix[4] + ", 0, 0)";
      (0, _modifyCss.default)(gridContainer, {
        transform: transform
      });
    };

    Grid.prototype.getContainer = function () {
      return this.get('container');
    };

    Grid.prototype.destroy = function () {
      const graph = this.get('graph');
      const graphContainer = graph.get('container');
      const container = this.get('container');
      graphContainer.removeChild(container);
    };

    return Grid;
  }(_base.default);

const _default = Grid;
exports.default = _default;
