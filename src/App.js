import React, { Component } from 'react';
import Select from 'react-select';
import { distance } from './libs/util';
import cams from './libs/camData';
import CamView from './components/CamView';
import 'react-select/dist/react-select.css';
import './App.css';


const options = cams.map(cam => ({
  label: cam.displayName,
  value: cam
}));
class App extends Component {
  constructor() {
    super();
    const state = localStorage.getItem('state');
    this.state = (state && JSON.parse(state)) || {
      selectedCams: [],
      selectedCamsData: [],
      waitingForLocation: false,
    };

    this.findCamAround = this.findCamAround.bind(this);
    this.selectCam = this.selectCam.bind(this);
  }

  findCamAround(radiusInMetter) {
    if (navigator.geolocation) {
      this.setState({ waitingForLocation: true });
      navigator.geolocation.getCurrentPosition((position) => {
        const selectedCams = cams.filter(
          cam => distance(
            Number(cam.latlon.lat),
            Number(cam.latlon.lon),
            position.coords.latitude,
            position.coords.longitude
          ) < radiusInMetter
        );
        this.setState({
          selectedCams: selectedCams.map(cam => ({ label: cam.displayName, value: cam })),
          selectedCamsData: selectedCams,
          waitingForLocation: false
        });
      });
    } else {
      alert('Your browser doesn\'t supported.');
    }
  }

  selectCam(value) {
    this.setState({
      selectedCams: value,
      selectedCamsData: value.map(v => v.value)
    });
  }

  render() {
    localStorage.setItem('state', JSON.stringify(this.state));

    return (
      <div className="App">
        <div className="App-Header">
          <h2>Camera kẹt xe</h2>
        </div>
        <div className="App-Body">
          <img style={{ display: 'none' }} src="http://giaothong.hochiminhcity.gov.vn/" width="0" height="0" alt="no-display" />
          <div className="App-Control">
            <div className="App-Control-FindAround">
              <h3>Xem quanh đây: </h3>
              <button onClick={()=>this.findCamAround(1000)}>1 km</button>
              <button onClick={()=>this.findCamAround(2000)}>2 km</button>
              <button onClick={()=>this.findCamAround(2000)}>3 km</button>
              <button onClick={()=>this.findCamAround(2000)}>4 km</button>
              <button onClick={()=>this.findCamAround(5000)}>5 km</button>
              <button onClick={()=>this.findCamAround(10000)}>10 km</button>
              <button onClick={()=>this.findCamAround(20000)}>20 km</button>
              {this.state.waitingForLocation ? ' waiting for location...' : ''}
            </div>
            <div className="App-Control-Select">
              <h3>Tìm theo tên đường</h3>
              <Select
                name="form-field-name"
                value={this.state.selectedCams}
                options={options}
                onChange={this.selectCam}
                multi={true}
                />
            </div>
          </div>
          <div>
            {this.state.selectedCamsData.map(cam => (
              <CamView key={cam.camId} cam={cam} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
