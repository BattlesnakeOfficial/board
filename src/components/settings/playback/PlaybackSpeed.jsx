import style from "./PlaybackSpeed.module.css";
import { DEFAULT_FRAMERATE } from "../defaults";

export const SLIDER_SLOW = 1;
export const SLIDER_MEDIUM = 2;
export const SLIDER_FAST = 3;

export const SPEED_SLOW = 3;
export const SPEED_MEDIUM = DEFAULT_FRAMERATE;
export const SPEED_FAST = 20;

const speedRanges = {
  SPEED_SLOW: { min: 1, max: 5 },
  SPEED_MEDIUM: { min: 6, max: 12 },
  SPEED_FAST: { min: 13, max: 20 }
};

function valueChanged(e, changeHandler) {
  let fps = SPEED_FAST;
  const sliderValue = e.target.valueAsNumber || e.target.value;

  if (sliderValue <= SLIDER_SLOW) {
    fps = SPEED_SLOW;
  } else if (sliderValue <= SLIDER_MEDIUM) {
    fps = SPEED_MEDIUM;
  }

  changeHandler.call(this, fps);
}

function defaultValueHandler(value) {
  let defaultValue = SLIDER_MEDIUM;

  if (value <= speedRanges.SPEED_SLOW.max) {
    defaultValue = SLIDER_SLOW;
  } else if (value > speedRanges.SPEED_MEDIUM.max) {
    defaultValue = SLIDER_FAST;
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
