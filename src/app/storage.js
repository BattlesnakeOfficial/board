import {
  DEFAULT_FRAMERATE,
  initialSettings
} from "../components/settings/defaults";

export function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      ((e instanceof DOMException &&
        // everything except Firefox
        e.code === 22) ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

export function getLocalSetting(key) {
  if (storageAvailable("localStorage")) {
    return window.localStorage.getItem(key);
  }
}

export function setLocalSetting(key, value) {
  if (storageAvailable("localStorage")) {
    window.localStorage.setItem(key, value);
  }
}

export function rehydrateLocalSettings() {
  let checkAutoplay = getLocalSetting("autoplay");
  let checkShowFrameScrubber = getLocalSetting("showFrameScrubber");

  let showCoordinateLabels = getLocalSetting("showCoordinateLabels");

  if (typeof checkAutoplay === "undefined") {
    checkAutoplay = initialSettings.autoplay;
  } else {
    checkAutoplay = checkAutoplay === "true";
  }

  if (typeof checkShowFrameScrubber === "undefined") {
    checkShowFrameScrubber = initialSettings.showFrameScrubber;
  } else {
    checkShowFrameScrubber = checkShowFrameScrubber === "true";
  }

  if (typeof showCoordinateLabels === "undefined") {
    showCoordinateLabels = initialSettings.showCoordinateLabels;
  } else {
    showCoordinateLabels = showCoordinateLabels === "true";
  }

  return {
    frameRate: Number(getLocalSetting("frameRate")) || DEFAULT_FRAMERATE,
    theme: getLocalSetting("theme") || initialSettings.theme,
    showFrameScrubber: checkShowFrameScrubber,
    autoplay: checkAutoplay,
    showCoordinateLabels: showCoordinateLabels
  };
}
