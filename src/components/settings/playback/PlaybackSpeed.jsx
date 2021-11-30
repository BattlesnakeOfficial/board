import style from "./PlaybackSpeed.module.css";

const SLIDER_SLOW = 1;
const SLIDER_MEDIUM = 2;
const SLIDER_FAST = 3;

const SPEED_SLOW = 6;
const SPEED_MEDIUM = 10;
const SPEED_FAST = 20;

function valueChanged(e, changeHandler) {
  let fps = SPEED_FAST;
  const sliderValue = e.target.value;

  if (sliderValue <= SLIDER_SLOW) {
    fps = SPEED_SLOW;
  } else if (sliderValue <= SLIDER_MEDIUM) {
    fps = SPEED_MEDIUM;
  }

  changeHandler.call(this, fps);
}

function defaultValueHandler(value) {
  let defaultValue = SLIDER_FAST;

  if (value <= SPEED_SLOW) {
    defaultValue = SLIDER_SLOW;
  } else if (value <= SPEED_MEDIUM) {
    defaultValue = SLIDER_MEDIUM;
  }

  return defaultValue;
}

const PlaybackSpeed = props => {
  return (
    <div className="input-container">
      <input
        type="range"
        min={SLIDER_SLOW}
        max={SLIDER_FAST}
        value={defaultValueHandler(props.default)}
        onChange={e => valueChanged(e, props.onChange)}
      />
      <div className={style.labels}>
        <span>Slow</span>
        <span>Medium</span>
        <span>Fast</span>
      </div>
    </div>
  );
};

export default PlaybackSpeed;
