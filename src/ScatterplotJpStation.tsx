/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { StaticMap } from 'react-map-gl';
import DeckGL from 'deck.gl';
import * as yamanoteData from './data/station.yamanote.json';
const renderLayers = require('./modules/deckgl-layers').renderLayers;
const controls = require('./modules/controls');
const LayerControls = controls.LayerControls;
const MapStylePicker = controls.MapStylePicker;
const SCATTERPLOT_CONTROLS = controls.SCATTERPLOT_CONTROLS;
const tooltipStyle = require('./modules/style').tooltipStyle;

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
  longitude: 139.7,
  latitude: 35.7,
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
  points: number[];
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

class ScatterplotJpStation extends React.Component<{}, ViewState> {
  constructor(props: any) {
    super(props);
    this.state = VIEW_STATE;
  }

  componentDidMount() {
    this._processData();
  }

  _updateLayerSettings(settings: any) {
    this.setState({ settings });
  }

  _onHover({ x, y, object }: any) {
    const label = object ? `${object.position[2]}` : null;
    this.setState({ hover: { x, y, hoveredObject: object, label } });
  }

  _processData() {
    const points = yamanoteData.reduce((accu: any, curr: any) => {
      accu.push({
        position: [
          Number(curr['geo:long']),
          Number(curr['geo:lat']),
          curr['dc:title']
        ]
      });
      return accu;
    }, []);
    this.setState({
      points
    });
  }

  onStyleChange = (style: any) => {
    this.setState({ style: style });
  };

  render(): JSX.Element | null {
    const data = this.state.points;
    if (!data.length) {
      return null;
    }
    const { hover, settings } = this.state;

    return (
      <div>
        {hover.hoveredObject && (
          <div
            style={{
              ...tooltipStyle,
              transform: `translate(${hover.x}px, ${hover.y}px)`
            }}
          >
            <div>{hover.label}</div>
          </div>
        )}
        <MapStylePicker
          onStyleChange={this.onStyleChange}
          currentStyle={this.state.style}
        />
        <LayerControls
          settings={settings}
          propTypes={SCATTERPLOT_CONTROLS}
          onChange={(settings: any) => this._updateLayerSettings(settings)}
        />
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
            mapStyle={this.state.style}
            mapboxApiAccessToken={MAPBOX_TOKEN}
          />
        </DeckGL>
      </div>
    );
  }
}

ReactDOM.render(<ScatterplotJpStation />, document.querySelector('.content'));
