/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MapGL from 'react-map-gl';

const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

interface ViewPort {
  width: number;
  height: number;
  longitude: number;
  latitude: number;
  zoom: number;
  maxZoom: number;
}

interface ViewState {
  style: string;
  viewport: ViewPort;
}

const viewState: ViewState = {
  style: 'mapbox://styles/mapbox/light-v9',
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight,
    longitude: -74,
    latitude: 40.7,
    zoom: 11,
    maxZoom: 16
  }
};

class StartMapGL extends React.Component<{}, ViewState> {
  constructor(props: any) {
    super(props);
    this.state = viewState;
  }

  render(): JSX.Element {
    return (
      <div>
        <MapGL
          {...this.state.viewport}
          mapStyle={this.state.style}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />
      </div>
    );
  }
}

ReactDOM.render(<StartMapGL />, document.querySelector('.content'));
