import React from "react";

import ErrorMessage from "./ErrorMessage";

export default {
  title: "Components/ErrorMessage",
  component: ErrorMessage
};

const Template = args => <ErrorMessage {...args} />;

export const DisplayError = Template.bind({});
DisplayError.args = {
  error: "1: Lorem oopsum error message here."
};

export const NoError = Template.bind({});
NoError.args = {
  error: ""
};
