import React, { Component } from 'react';
import { Icon } from 'antd';
import { copyTextToClipboard } from '../../lib/DocUtil';
import EventNotify from '../../lib/EventNotify';
import './index.css';

const { EVENT_FILE_EXPLORER_RIGHT_CLICK } = EventNotify; 
export default class RightMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      node: null,
      contextmenuStyle: {
        display: 'none'
      }
    };
  }

  menuClick(action) {
    console.log('componentWillMount', action, this.state.node.name);
    switch(action) {
      case 'copy': 
        copyTextToClipboard(this.state.node.name);
        break;
      case 'copypath':
        copyTextToClipboard(this.state.node.filepath)
        break;
      case 'rename': 
        break;
      case 'delete': 
        break;
    }
  }

  componentWillMount() {
    EventNotify.on(EVENT_FILE_EXPLORER_RIGHT_CLICK, ({ node, target }) => {
      console.log('componentWillMount', node, target);
      this.setState({
        node,
        contextmenuStyle: {
          display: 'block',
          left: target.clientX,
          top: target.clientY + 12
        }
      })
    });
    document.addEventListener('click', e => {
      if (this.state.contextmenuStyle.display === 'block') {
        this.setState({
          node: null,
          contextmenuStyle: {
            display: 'none'
          }
        });
      }
    });
  }

  render() {
    return <div className="file-context-menu" style = {this.state.contextmenuStyle}>
      <div className="context-menu-item">
          <div className="menu-inner-item" onClick={this.menuClick.bind(this, 'copy')}>
            <Icon type="copy"></Icon> Copy
          </div>
      </div>
      <div className="context-menu-item">
          <div className="menu-inner-item" onClick={this.menuClick.bind(this, 'copypath')}>
            <Icon type="copy"></Icon> Copy Path
          </div>
      </div>
      <div className="context-menu-item">
          <div className="menu-inner-item" onClick={this.menuClick.bind(this, 'rename')}>
            <Icon type="form"></Icon> Rename
          </div>
      </div>
      <div className="context-menu-item">
          <div className="menu-inner-item" onClick={this.menuClick.bind(this, 'delete')}>
              <Icon type="delete"></Icon> Delete
          </div>
      </div>
    </div>;
  }
}