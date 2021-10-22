import { Slider, SliderMarker } from "@reach/slider";
import "@reach/slider/styles.css";
import "./PlaybackSpeed.css";

const PlaybackSpeed = props => {
  return (
    <Slider min={1} max={20} step={1} defaultValue={props.default || 20}>
      <SliderMarker value={6}>
        <span className="title">Slow</span>
      </SliderMarker>
      <SliderMarker value={10}>
        <span className="title">Medium</span>
      </SliderMarker>
      <SliderMarker value={20}>
        <span className="title">Fast</span>
      </SliderMarker>
    </Slider>
  );
};

export default PlaybackSpeed;
