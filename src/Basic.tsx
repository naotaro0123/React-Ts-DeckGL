/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import DeckGL, { LineLayer, LineLayerDatum } from 'deck.gl';

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: 0;
  bearing: 0;
}

const viewState: ViewState = {
  longitude: -122.41699,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

const data: LineLayerDatum[] = [
  {
    sourcePosition: [-122.41699, 37.7853],
    targetPosition: [-122.41699, 37.781]
  }
];

class Basic extends React.Component {
  constructor(props: any) {
    super(props);
  }

  render(): JSX.Element {
    const layers = [
      new LineLayer({
        id: 'line-layer',
        data
      })
    ];
    return <DeckGL viewState={viewState} layers={layers} />;
  }
}

ReactDOM.render(<Basic />, document.querySelector('.content'));
