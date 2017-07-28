import React from 'react';
import './style.css';

const camUrl = "http://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=";
const waitToUpdate = 11;

class CamView extends React.Component{
  constructor() {
    super();
    this.state = {
      no: 0,
      count: 1
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      const count = this.state.count + 1;
      if (count % waitToUpdate === 0) {
        this.setState({
          no: this.state.no + 1,
          count: 1
        });
      } else {
        this.setState({
          count
        });
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { cam } = this.props;
    return (
      <div className="CamView">
        <p><b>{cam.displayName}</b> ({waitToUpdate-this.state.count} s)</p>
        <img className="CamView-img" src={`${camUrl}${cam.camId}?no=${this.state.no}`} alt={cam.displayName} />
      </div>
    )
  }
}

export default CamView;
