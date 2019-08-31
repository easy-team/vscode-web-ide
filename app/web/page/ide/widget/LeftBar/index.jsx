import React, { Component } from 'react';
import { Icon } from 'antd';
import './index.css';

export default class LeftBar extends Component {
  render() {
    return <div className="editor-left-bar-container">
      <div className="editor-left-bar-item"><Icon type="search" style={{ fontSize: '30px' }} /></div>
      <div className="editor-left-bar-item"><Icon type="setting" style={{ fontSize: '30px' }} /></div>
    </div>;
  }
}