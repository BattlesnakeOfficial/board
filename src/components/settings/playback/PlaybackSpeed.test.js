import React from "react";
import { render, screen } from "@testing-library/react";

import PlaybackSpeed, { SLIDER_MEDIUM } from "./PlaybackSpeed";

it("renders with or without a default speed", () => {
  render(<PlaybackSpeed />);

  const speedSlider = screen.getByRole("slider");

  expect(speedSlider).toBeInTheDocument();
  expect(speedSlider).toHaveValue(SLIDER_MEDIUM);
});
