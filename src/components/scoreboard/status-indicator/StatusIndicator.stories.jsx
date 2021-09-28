import React from "react";

import StatusIndicator from "./StatusIndicator";

export default {
  title: "Components/StatusIndicator",
  component: StatusIndicator,
  argTypes: { clickHandler: { action: "clicked" } }
};

// const onClickHandler = errorCode => {
//   console.log("Toggle status display for ", errorCode);
// };

const Template = args => <StatusIndicator {...args} />;

export const DisplayError = Template.bind({});
DisplayError.args = {
  code: 1
};

export const NoError = Template.bind({});
NoError.args = {
  code: 0
};
