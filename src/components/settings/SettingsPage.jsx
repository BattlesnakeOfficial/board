import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  currentFrameRate,
  currentTheme,
  frameRateUpdated,
  themeSelected
} from "./settings-slice";
import PlaybackSpeed from "./playback/PlaybackSpeed";
import "./SettingsPage.module.css";
import { useHistory } from "react-router-dom";
import { togglePlayButtons } from "../../actions";

const SettingsPage = () => {
  const history = useHistory();
  const theme = useSelector(currentTheme);
  const playbackSpeed = useSelector(currentFrameRate);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(togglePlayButtons("hide"));
  });

  return (
    <main className={theme}>
      <section>
        <h2>Board Settings</h2>
        <div>
          <PlaybackSpeed
            default={playbackSpeed}
            onChange={e => dispatch(frameRateUpdated(e.target.value))}
          />
        </div>
        <div>
          <input
            type="radio"
            value="light"
            name="theme"
            checked={theme === "light"}
            onChange={e => dispatch(themeSelected(e.target.value))}
          />{" "}
          Light
          <input
            type="radio"
            value="dark"
            name="theme"
            checked={theme === "dark"}
            onChange={e => dispatch(themeSelected(e.target.value))}
          />{" "}
          Dark
        </div>
        <div>
          <button onClick={() => history.goBack()}>Return to Game</button>
        </div>
      </section>
    </main>
  );
};

export default SettingsPage;
