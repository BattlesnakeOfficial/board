import React from "react";
import { useSelector } from "react-redux";
import { currentTheme } from "./settings-slice";
import PlaybackSpeed from "./playback/PlaybackSpeed";

const SettingsPage = () => {
  const theme = useSelector(currentTheme);
  // const dispatch = useDispatch();
  // const [selectedTheme, setSelectedTheme] = useState();

  return (
    <>
      <h2>Board Settings</h2>
      <div>
        <PlaybackSpeed default={6} />
      </div>
      <div>
        <span>
          <strong>Current theme:</strong> {theme}
        </span>
      </div>
    </>
  );
};

export default SettingsPage;
