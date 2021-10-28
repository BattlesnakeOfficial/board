const PlaybackSpeed = props => {
  return (
    <select defaultValue={props.default} onChange={props.onChange}>
      <option value={6}>Slow</option>
      <option value={10}>Medium</option>
      <option value={20}>Fast</option>
    </select>
  );
};

export default PlaybackSpeed;
