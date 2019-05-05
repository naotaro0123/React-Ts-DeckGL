/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { StaticMap } from 'react-map-gl';
import DeckGL from 'deck.gl';
import { TripsLayer } from '@deck.gl/geo-layers';
import * as TRIP_DATA from './data/sf.trips.json';

const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

interface ViewPort {
  longitude: number;
  latitude: number;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  pitch: number;
  bearing: number;
  visible: boolean;
}

interface ViewState {
  style: string;
  viewport: ViewPort;
}

const initialViewState: ViewState = {
  style: 'mapbox://styles/mapbox/light-v9',
  viewport: {
    longitude: -122.4,
    latitude: 37.74,
    zoom: 11,
    minZoom: 0,
    maxZoom: 20,
    pitch: 30,
    bearing: 0,
    visible: true
  }
};

const viewport = {
  width: window.innerWidth,
  height: window.innerHeight
};

class TripLayer extends React.Component<{}, ViewState> {
  constructor(props: any) {
    super(props);
    this.state = initialViewState;
  }

  _renderLayers() {
    return [
      new TripsLayer({
        id: 'trips',
        data: TRIP_DATA,
        getPath: (d: any) =>
          d.waypoints.map((p: any) => [
            p.coordinates[0],
            p.coordinates[1],
            p.timestamp - 1554772579000
          ]),
        getColor: [253, 128, 93],
        opacity: 0.8,
        widthMinPixels: 5,
        rounded: true,
        trailLength: 200,
        currentTime: 100
      })
    ];
  }

  render(): JSX.Element {
    return (
      <DeckGL
        layers={this._renderLayers()}
        initialViewState={this.state.viewport}
        controller
      >
        <StaticMap {...viewport} mapboxApiAccessToken={MAPBOX_TOKEN} />
      </DeckGL>
    );
  }
}
