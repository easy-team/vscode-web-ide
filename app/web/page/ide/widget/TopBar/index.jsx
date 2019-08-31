import React, { Component } from 'react';
import { Menu, Dropdown } from 'antd';
import ActionBar from '../ActionBar';
import Logo from 'asset/images/ide.png';
import './index.css';


export default class TopBar extends Component {
  fileMenus = (
    <Menu>
      <Menu.Item><a target="_blank" href="#">File</a></Menu.Item>
    </Menu>
  );
  editMenus = (
    <Menu>
      <Menu.Item><a target="_blank" href="#">Edit</a></Menu.Item>
    </Menu>
  );
  buildMenus = (
    <Menu>
      <Menu.Item><a target="_blank" href="#">Build</a></Menu.Item>
    </Menu>
  );
  viewMenus = (
    <Menu>
      <Menu.Item><a target="_blank" href="#">View</a></Menu.Item>
    </Menu>
  );
  helpMenus = (
    <Menu>
      <Menu.Item><a target="_blank" href="https://microsoft.github.io/monaco-editor">Monaco Editor Doc</a></Menu.Item>
      <Menu.Item><a target="_blank" href="https://github.com/microsoft/monaco-editor">Monaco Editor GitHub</a></Menu.Item>
    </Menu>
  );
  render() {
    return <div className="top-bar">
      <div className="top-bar-file">
        <div className="top-bar-file-item logo">
          <img src={Logo} width="36" height="36" />
        </div>
        <div className="top-bar-file-item">
          <Dropdown overlayClassName="top-bar-menu-bg" overlay={this.fileMenus} placement="bottomLeft"><div>File</div></Dropdown>
        </div>
        <div className="top-bar-file-item">
          <Dropdown overlayClassName="top-bar-menu-bg" overlay={this.editMenus} placement="bottomLeft"><div>Edit</div></Dropdown>
        </div>
        <div className="top-bar-file-item">
          <Dropdown overlayClassName="top-bar-menu-bg" overlay={this.buildMenus} placement="bottomLeft"><div>Build</div></Dropdown>
        </div>
        <div className="top-bar-file-item">
          <Dropdown overlayClassName="top-bar-menu-bg" overlay={this.viewMenus} placement="bottomLeft"><div>View</div></Dropdown>
        </div>
        <div className="top-bar-file-item">
          <Dropdown overlayClassName="top-bar-menu-bg" overlay={this.helpMenus} placement="bottomLeft"><div>Help</div></Dropdown>
        </div>
      </div>
      <div className="top-bar-code"></div>
      <ActionBar project={this.props.project}></ActionBar>
    </div>;
  }
}