import style from "./PlaybackSpeed.module.css";

const PlaybackSpeed = props => {
  return (
    // <select defaultValue={props.default} onChange={props.onChange}>
    //   <option value={6}>Slow</option>
    //   <option value={10}>Medium</option>
    //   <option value={20}>Fast</option>
    // </select>
    <div className="input-container">
      <input
        type="range"
        min={1}
        max={3}
        value={props.default}
        onChange={props.onChange}
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
