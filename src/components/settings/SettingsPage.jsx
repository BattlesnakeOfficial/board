import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  autoPlayUpdated,
  currentAutoplay,
  currentFrameRate,
  currentTheme,
  frameRateUpdated,
  themeSelected
} from "./settings-slice";
import PlaybackSpeed from "./playback/PlaybackSpeed";
import "./SettingsPage.module.css";
import { useHistory } from "react-router-dom";
import { togglePlayButtons, themeChanged } from "../../actions";

const SettingsPage = () => {
  const history = useHistory();
  const theme = useSelector(currentTheme);
  const playbackSpeed = useSelector(currentFrameRate);
  const autoplay = useSelector(currentAutoplay);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(togglePlayButtons("hide"));
  });

  function dispatchSpeedChange(fps) {
    dispatch(frameRateUpdated(fps));
  }

  return (
    <main className={theme}>
      <section>
        <h2>Board Settings</h2>
        <fieldset>
          <legend>Playback Speed</legend>
          <div className="info">Adjust the playback speed of your games</div>
          <PlaybackSpeed
            default={playbackSpeed}
            onChange={dispatchSpeedChange}
          />
        </fieldset>
        <fieldset>
          <legend>Theme</legend>
          <input
            type="radio"
            value="light"
            name="theme"
            checked={theme === "light"}
            onChange={e =>
              dispatch(themeSelected(e.target.value)) &&
              dispatch(themeChanged(e.target.value))
            }
          />
          Light
          <input
            type="radio"
            value="dark"
            name="theme"
            checked={theme === "dark"}
            onChange={e =>
              dispatch(themeSelected(e.target.value)) &&
              dispatch(themeChanged(e.target.value))
            }
          />
          Dark
        </fieldset>
        <fieldset>
          <input
            type="checkbox"
            name="autoplay"
            checked={autoplay}
            onChange={e => dispatch(autoPlayUpdated(e.target.checked))}
          />
          Autoplay
        </fieldset>
        <div>
          <button onClick={() => history.goBack()}>Return to Game</button>
        </div>
      </section>
    </main>
  );
};

export default SettingsPage;
