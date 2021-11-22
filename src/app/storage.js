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

  if (typeof checkAutoplay === "undefined") {
    checkAutoplay = true; // default to true
  } else {
    checkAutoplay = checkAutoplay === "true";
  }

  return {
    frameRate: Number(getLocalSetting("frameRate")) || 10,
    theme: getLocalSetting("theme") || "light",
    autoplay: checkAutoplay
  };
}
