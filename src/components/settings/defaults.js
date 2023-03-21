import { themes } from "../../theme";

export const DEFAULT_FRAMERATE = 6;

export const initialSettings = {
  frameRate: DEFAULT_FRAMERATE,
  theme: themes.light,
  autoplay: false,
  showFrameScrubber: false,
  persistAvailable: false,
  showCoordinateLabels: false
};
