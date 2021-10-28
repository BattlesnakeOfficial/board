import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  currentFrameRate,
  currentTheme,
  frameRateUpdated
} from "./settings-slice";
import PlaybackSpeed from "./playback/PlaybackSpeed";
import "./SettingsPage.module.css";

const SettingsPage = () => {
  const theme = useSelector(currentTheme);
  const playbackSpeed = useSelector(currentFrameRate);
  const dispatch = useDispatch();

  return (
    <main className={theme}>
      <section>
        <h2>Board Settings</h2>
        <div>
          <PlaybackSpeed
            default={playbackSpeed}
            onChange={value => dispatch(frameRateUpdated(value))}
          />
        </div>
        {/*<div>*/}
        {/*  <span>*/}
        {/*    <strong*/}
        {/*      onClick={() =>*/}
        {/*        dispatch(themeSelected(theme === "light" ? "dark" : "light"))*/}
        {/*      }*/}
        {/*    >*/}
        {/*      Current theme:*/}
        {/*    </strong>{" "}*/}
        {/*    {theme}*/}
        {/*  </span>*/}
        {/*</div>*/}
      </section>
    </main>
  );
};

export default SettingsPage;
