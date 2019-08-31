import React, { Component } from 'react';
import { Modal } from 'antd';
import './index.css';
export default class Create extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Modal 
          visible={this.props.visible}  
          onOk={this.props.handle}
          onCancel={this.props.handle}>
            <h1>Create Template Project</h1>
    </Modal>;
  }
}