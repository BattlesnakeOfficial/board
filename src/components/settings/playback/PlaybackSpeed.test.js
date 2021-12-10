import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import PlaybackSpeed, {
  SLIDER_FAST,
  SLIDER_MEDIUM,
  SLIDER_SLOW,
  SPEED_FAST,
  SPEED_MEDIUM,
  SPEED_SLOW
} from "./PlaybackSpeed";

describe("renders with or without a default speed", () => {
  it("uses medium as default when no value provided", () => {
    render(<PlaybackSpeed />);

    const speedSlider = screen.getByRole("slider");

    expect(speedSlider).toBeInTheDocument();
    expect(speedSlider).toHaveValue(String(SLIDER_MEDIUM));
  });

  it("renders the supplied value as default", () => {
    render(<PlaybackSpeed default={1} />);

    const speedSlider = screen.getByRole("slider");

    expect(speedSlider).toHaveValue(String(SLIDER_SLOW));
  });

  it("uses a default within range if supplied value is larger than max range", () => {
    render(<PlaybackSpeed default={30} />);

    const speedSlider = screen.getByRole("slider");

    expect(Number(speedSlider.value)).toBeGreaterThanOrEqual(SLIDER_SLOW);
    expect(Number(speedSlider.value)).toBeLessThanOrEqual(SLIDER_FAST);
  });

  it("uses a default within range if supplied value is less than min range", () => {
    render(<PlaybackSpeed default={-1} />);

    const speedSlider = screen.getByRole("slider");

    expect(Number(speedSlider.value)).toBeGreaterThanOrEqual(SLIDER_SLOW);
    expect(Number(speedSlider.value)).toBeLessThanOrEqual(SLIDER_FAST);
  });
});

describe("renders the correct speed", () => {
  test.each([
    [1, SLIDER_SLOW],
    [5, SLIDER_SLOW],
    [6, SLIDER_MEDIUM],
    [12, SLIDER_MEDIUM],
    [13, SLIDER_FAST],
    [20, SLIDER_FAST]
  ])("framerate: %i", (fps, expected) => {
    render(<PlaybackSpeed default={fps} />);
    const speedSlider = screen.getByRole("slider");

    expect(speedSlider).toHaveValue(String(expected));
  });
});

describe("sends the correct framerate to callback when slider value changes", () => {
  test.each([
    [SPEED_FAST, SLIDER_SLOW, SPEED_SLOW],
    [SPEED_SLOW, SLIDER_MEDIUM, SPEED_MEDIUM],
    [SPEED_MEDIUM, SLIDER_FAST, SPEED_FAST]
  ])(
    "currentFramerate: %i, selectedSpeed: %i, framerate: %i",
    (currentFramerate, sliderSpeed, fps) => {
      const speedChangedCallback = jest.fn();
      const { getByRole } = render(
        <PlaybackSpeed
          default={currentFramerate}
          onChange={speedChangedCallback}
        />
      );
      fireEvent.change(getByRole("slider"), { target: { value: sliderSpeed } });
      expect(speedChangedCallback).toHaveBeenCalledWith(fps);
    }
  );
});
