import React from "react";

import Avatar from "./avatar";

export default {
  title: "Components/Avatar",
  component: Avatar
};

const defaultSnake = {
  // body: [{"right left down up", "head tail body", "true undefined", 1, 0}],
  body: [],
  color: "#000000",
  _id: "totally-unique-id",
  name: "Sir Hiss",
  effectiveSpace: 3,
  health: 100,
  latency: 100,
  error: "",
  timing: {},
  isDead: false,
  death: {
    cause: "collided with wall",
    turn: 1,
    eliminatedBy: ""
  },
  head: "default",
  tail: "default",
  headSvg: "",
  tailSvg: "",
  squad: "Squad name",
  author: "Autherhandle",
  shout: "This is my shout"
};

const Template = args => <Avatar {...args} />;

export const Empty = Template.bind({});
Empty.args = {
  snake: defaultSnake
};

const fullHealthSnake = { ...defaultSnake };
fullHealthSnake.death = null;
export const FullHealthSnake = Template.bind({});
FullHealthSnake.args = {
  snake: fullHealthSnake
};

export const DeadSnake = Template.bind({});
DeadSnake.args = {
  snake: defaultSnake
};

const greenSnake = { ...fullHealthSnake };
greenSnake.color = "#008800";
export const GreenSnake = Template.bind({});
GreenSnake.args = {
  snake: greenSnake
};

const lowHealthSnake = { ...fullHealthSnake };
lowHealthSnake.health = 10;
export const LowHealthSnake = Template.bind({});
LowHealthSnake.args = {
  snake: lowHealthSnake
};

const errorSnake = { ...fullHealthSnake };
errorSnake.error = "1:Lorem ooopsum";
export const ErrorSnake = Template.bind({});
ErrorSnake.args = {
  snake: errorSnake
};

const timingsSnake = { ...fullHealthSnake };
timingsSnake.latency = 5;
timingsSnake.timing = {
  Connect: 0,
  DNS: 0,
  FirstByte: 0,
  Latency: 503520,
  TLS: 0
};
export const TimingsSnake = Template.bind({});
TimingsSnake.args = {
  snake: timingsSnake
};
