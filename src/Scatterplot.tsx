/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { StaticMap } from 'react-map-gl';
import DeckGL, { ScatterplotLayer } from 'deck.gl';
// const controls = require('./modules/controls.js');
const taxiData = require('./data/taxi');

interface InitialViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  pitch: number;
  bearing: number;
}

const initialViewState: InitialViewState = {
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

interface ViewState {
  points?: number[];
  style: string;
}

const viewState: ViewState = {
  style: 'mapbox://styles/mapbox/light-v9'
};

class Scatterplot extends React.Component<{}, ViewState> {
  constructor(props: any) {
    super(props);
    this.state = viewState;
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

  render(): JSX.Element {
    const layers = [
      new ScatterplotLayer({
        id: 'scatterplot',
        getPosition: (d: any) => d.position,
        getColor: (d: any) => [0, 128, 255],
        getRadius: (d: any) => 5,
        opacity: 0.5,
        pickable: true,
        radiusMinPixels: 0.25,
        radiusMaxPixels: 30,
        data: this.state.points
      })
    ];

    return (
      <div>
        <DeckGL
          initialViewState={initialViewState}
          layers={layers}
          controller
        />
        <StaticMap {...viewport} style={this.state} />
      </div>
    );
  }
}

ReactDOM.render(<Scatterplot />, document.querySelector('.content'));
