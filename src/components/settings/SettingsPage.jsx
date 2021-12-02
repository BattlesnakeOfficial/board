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
import styles from "./SettingsPage.module.css";
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
        <h2>Playback Settings</h2>
        <fieldset>
          <legend>Playback Speed</legend>
          <div className={styles.info}>
            Adjust the playback speed of your games
          </div>
          <div className={styles.inputContainer}>
            <PlaybackSpeed
              default={playbackSpeed}
              onChange={dispatchSpeedChange}
            />
          </div>
        </fieldset>
        <fieldset>
          <legend>Theme</legend>
          <div className={styles.info}>Change your game theme colors</div>
          <div className={styles.inputContainer}>
            <label>
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
              <span className={styles.radio} />
              Light
            </label>
            <label>
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
              <span className={styles.radio} />
              Projector
            </label>
          </div>
        </fieldset>
        <fieldset>
          <legend>Autoplay</legend>
          <div className={styles.info}>
            All games will start playing as soon as the game loads
          </div>
          <div className={styles.inputContainer}>
            <label>
              <input
                type="checkbox"
                name="autoplay"
                checked={autoplay}
                onChange={e => dispatch(autoPlayUpdated(e.target.checked))}
              />
              <span className={styles.checkmark} />
              {autoplay ? "On" : "Off"}
            </label>
          </div>
        </fieldset>
        <fieldset className={styles.centered}>
          <button onClick={() => history.goBack()}>Return to Game</button>
        </fieldset>
      </section>
    </main>
  );
};

export default SettingsPage;
