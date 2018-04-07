import React, { Component } from 'react';

class SuicidalButton extends Component {
  constructor(props) {
    super(props);
    this.state = {value: true};
  }
  render() {
    if (!this.state.value) return null;
    return (
      <button onClick={() => this.setState({value: false})}>
        FUCK
      </button>
    );
  }
}

export default SuicidalButton;
