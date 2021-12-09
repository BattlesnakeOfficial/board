import style from "./PlaybackSpeed.module.css";

export const SLIDER_SLOW = 1;
export const SLIDER_MEDIUM = 2;
export const SLIDER_FAST = 3;

export const SPEED_SLOW = 6; // new 3
export const SPEED_MEDIUM = 10; // new 6
export const SPEED_FAST = 20;

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
    <>
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
    </>
  );
};

export default PlaybackSpeed;
