import React from "react";
// import { connect } from "react-redux";
// import mapStateToProps from "react-redux/lib/connect/mapStateToProps";
// import mapDispatchToProps from "react-redux/lib/connect/mapDispatchToProps";

class SettingsPage extends React.Component {
  state = {
    settings: {
      playbackSpeed: ""
    }
  };

  handleChange = event => {
    // copy current state
    const settings = {
      ...this.state.settings,
      playbackSpeed: event.target.value
    };
    this.setState({ settings: settings });
  };

  handleSubmit = event => {
    event.preventDefault();
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Board Settings</h2>
        <input
          type="text"
          onChange={this.handleChange}
          value={this.state.settings.playbackSpeed}
        />
        <input type="submit" value="Save" />
      </form>
    );
  }
}

export default SettingsPage;
// export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
