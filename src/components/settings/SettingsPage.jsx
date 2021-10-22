import React from "react";
import { useSelector } from "react-redux";
import { currentTheme } from "./settings-slice";
import PlaybackSpeed from "./playback/PlaybackSpeed";
import { useLocalStorage } from "../../app/local-storage";

const SettingsPage = () => {
  const theme = useSelector(currentTheme);
  // const dispatch = useDispatch();
  // const [selectedTheme, setSelectedTheme] = useState();

  const [playbackSpeed, setPlaybackSpeed] = useLocalStorage(
    10,
    "playbackSpeed"
  );

  return (
    <section>
      <h2>Board Settings</h2>
      <div>
        <PlaybackSpeed default={playbackSpeed} onChange={setPlaybackSpeed} />
      </div>
      <div>
        <span>
          <strong>Current theme:</strong> {theme}
        </span>
      </div>
    </section>
  );
};

export default SettingsPage;
