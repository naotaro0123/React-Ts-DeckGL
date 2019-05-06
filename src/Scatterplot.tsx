/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { StaticMap } from 'react-map-gl';
const controls = require('./modules/controls');
const LayerControls = controls.LayerControls;
const MapStylePicker = controls.MapStylePicker;
const SCATTERPLOT_CONTROLS = controls.SCATTERPLOT_CONTROLS;
const tooltipStyle = require('./modules/style').tooltipStyle;
import DeckGL from 'deck.gl';
const taxiData = require('./data/taxi');
const renderLayers = require('./modules/deckgl-layers').renderLayers;

const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

interface InitialViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  pitch: number;
  bearing: number;
}

const INITIAL_VIEW_STATE: InitialViewState = {
  longitude: -74,
  latitude: 40.7,
  zoom: 11,
  minZoom: 5,
  maxZoom: 16,
  pitch: 0,
  bearing: 0
};

const viewport = {
  width: window.innerWidth,
  height: window.innerHeight
};

interface Hover {
  x: number;
  y: number;
  hoveredObject?: any;
  label?: string | null;
}

interface ViewState {
  hover: Hover;
  points?: number[];
  settings?: {};
  style: string;
}

const VIEW_STATE: ViewState = {
  hover: {
    x: 0,
    y: 0,
    hoveredObject: null
  },
  points: [],
  settings: Object.keys(SCATTERPLOT_CONTROLS).reduce(
    (accu, key) => ({
      ...accu,
      [key]: SCATTERPLOT_CONTROLS[key].value
    }),
    {}
  ),
  style: 'mapbox://styles/mapbox/light-v9'
};

class Scatterplot extends React.Component<{}, ViewState> {
  constructor(props: any) {
    super(props);
    this.state = VIEW_STATE;
  }

  componentDidMount() {
    this._processData();
  }

  _processData() {
    const points = taxiData.reduce((accu: any, curr: any) => {
      accu.push({
        position: [Number(curr.pickup_longitude), Number(curr.pickup_latitude)],
        pickup: true
      });
      accu.push({
        position: [
          Number(curr.dropoff_longitude),
          Number(curr.dropoff_latitude)
        ],
        piciup: false
      });
      return accu;
    }, []);
    this.setState({
      points
    });
  }

  onStyleChange = (style: any) => {
    this.setState({ style });
  };

  _onHover({ x, y, object }: any) {
    const label = object ? (object.pickup ? 'Pickup' : 'Dropoff') : null;
    this.setState({ hover: { x, y, hoveredObject: object, label } });
  }

  _updateLayerSettings(settings: any) {
    this.setState({ settings });
  }

  render(): JSX.Element {
    const { hover, settings, points } = this.state;

    return (
      <div>
        <div
          style={{
            ...tooltipStyle,
            transform: `translate(${hover.x}px, ${hover.y}px)`
          }}
        >
          <div>{hover.label}</div>
        </div>
        {/* <MapStylePicker
          onStyleChange={this.onStyleChange}
          currentStyle={this.state.style}
        /> */}
        {/* <LayerControls
          settings={settings}
          propTypes={SCATTERPLOT_CONTROLS}
          onChange={(settings: any) => this._updateLayerSettings(settings)}
        /> */}
        <DeckGL
          layers={renderLayers({
            data: this.state.points,
            onHover: (hover: any) => this._onHover(hover),
            settings: this.state.settings
          })}
          initialViewState={INITIAL_VIEW_STATE}
          controller
        >
          <StaticMap
            {...viewport}
            style={this.state}
            mapboxApiAccessToken={MAPBOX_TOKEN}
          />
        </DeckGL>
      </div>
    );
  }
}

ReactDOM.render(<Scatterplot />, document.querySelector('.content'));
