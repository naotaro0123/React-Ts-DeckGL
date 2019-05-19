/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { StaticMap } from 'react-map-gl';
import DeckGL, { HexagonLayer, LinearInterpolator } from 'deck.gl';
import { csv as requestCsv } from 'd3-request';

const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line
const DATA_URL =
  'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv'; // eslint-disable-line

const transitionInterpolator = new LinearInterpolator(['bearing']);

interface InitialViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  pitch: number;
  bearing: number;
  transitionInterpolator?: LinearInterpolator;
  transitionDuration?: number;
  onTransitionEnd?(): any;
}

const INITIAL_VIEW_STATE: InitialViewState = {
  longitude: -1.4157267858730052,
  latitude: 52.232395363869415,
  zoom: 6.6,
  minZoom: 5,
  maxZoom: 15,
  pitch: 40.5,
  bearing: 0
};

interface LightSettings {
  lightsPosition: number[];
  ambientRatio: number;
  diffuseRatio: number;
  specularRatio: number;
  lightsStrength: number[];
  numberOfLights: number;
}

const LIGHT_SETTINGS: LightSettings = {
  lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2
};

const COLOR_RANGE = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];

const viewport = {
  width: window.innerWidth,
  height: window.innerHeight
};

interface ViewState {
  viewState: InitialViewState;
  data: number[][] | null;
}

const VIEW_STATE: ViewState = {
  viewState: INITIAL_VIEW_STATE,
  data: null
};

class Hexagon extends React.Component<{}, ViewState> {
  constructor(props: any) {
    super(props);
    this.state = VIEW_STATE;

    this._onLoad = this._onLoad.bind(this);
    this._onViewStateChange = this._onViewStateChange.bind(this);
    this._rotateCamera = this._rotateCamera.bind(this);

    requestCsv(DATA_URL, (error, response) => {
      if (!error) {
        const data = response.map(d => [Number(d.lng), Number(d.lat)]);
        this.setState({ data });
      }
    });
  }

  _onLoad() {
    this._rotateCamera();
  }

  _onViewStateChange({ viewState }: any) {
    this.setState({ viewState });
  }

  _rotateCamera() {
    const angleDelta = 120.0;
    const bearing = this.state.viewState.bearing + angleDelta;
    this.setState({
      viewState: {
        ...this.state.viewState,
        bearing,
        transitionDuration: angleDelta * 35,
        transitionInterpolator: transitionInterpolator
        // onTransitionEnd: this._rotateCamera
      }
    });
  }

  _renderLayers(): any {
    const { data } = this.state;

    return [
      data &&
        new HexagonLayer({
          id: 'heatmap',
          colorRange: COLOR_RANGE,
          data,
          elevationRange: [0, 300],
          elevationScale: 50,
          extruded: true,
          getPosition: (d: any) => d,
          lightSettings: LIGHT_SETTINGS,
          opacity: 1,
          radius: 1000,
          upperPercentile: 100,
          coverage: 1
        })
    ];
  }

  render(): JSX.Element | null {
    const { viewState } = this.state;

    return (
      <DeckGL
        layers={this._renderLayers()}
        viewState={viewState}
        onLoad={this._onLoad}
        onViewStateChange={this._onViewStateChange}
        controller={true}
      >
        <StaticMap
          {...viewport}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />
      </DeckGL>
    );
  }
}

ReactDOM.render(<Hexagon />, document.querySelector('.content'));
