import React from "react";

import StatusIndicator from "./StatusIndicator";

export default {
  title: "Components/StatusIndicator",
  component: StatusIndicator,
  argTypes: { clickHandler: { action: "clicked" } }
};

const Template = args => <StatusIndicator {...args} />;

export const DisplayError = Template.bind({});
DisplayError.args = {
  errorMessage: "1:Lorem oopsum"
};

export const NoError = Template.bind({});
NoError.args = {
  errorMessage: ""
};
