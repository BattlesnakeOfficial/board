import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  currentPlaybackSpeed,
  currentTheme,
  playbackSpeedUpdated,
  themeSelected
} from "./settings-slice";
import PlaybackSpeed from "./playback/PlaybackSpeed";

const SettingsPage = () => {
  const theme = useSelector(currentTheme);
  const playbackSpeed = useSelector(currentPlaybackSpeed);
  const dispatch = useDispatch();

  return (
    <section>
      <h2>Board Settings</h2>
      <div>
        <PlaybackSpeed
          default={playbackSpeed}
          onChange={value => dispatch(playbackSpeedUpdated(value))}
        />
      </div>
      <div>
        <span>
          <strong
            onClick={() =>
              dispatch(themeSelected(theme === "light" ? "dark" : "light"))
            }
          >
            Current theme:
          </strong>{" "}
          {theme}
        </span>
      </div>
    </section>
  );
};

export default SettingsPage;
