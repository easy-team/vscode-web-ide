import React, { Component } from 'react';
import { Popover } from 'antd';
import { Treebeard, decorators } from 'react-treebeard';
import RightMenu from '../RightMenu';
import EventNotify from '../../lib/EventNotify';
import './index.css';

const { EVENT_FILE_EXPLORER, EVENT_FILE_EXPLORER_RIGHT_CLICK } = EventNotify; 
class Header extends Component {
  constructor(props) {
    super(props);
  }

  contextMenu(e) {
    e.preventDefault();
    EventNotify.emit(EVENT_FILE_EXPLORER_RIGHT_CLICK, { node: this.props.node, target: e })
  }

  render() {
    const { node, style } = this.props;
    return <div style={style.base}>
      <div onContextMenu={this.contextMenu.bind(this)} style={style.title}>{node.name}</div>
    </div>
  }
}

export default class FileExplorer extends Component {
  constructor(props){
    super(props);
    this.state = {
      tree: this.props.tree
    };
    this.onToggle = this.onToggle.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  onToggle(node, toggled){
      if(this.state.cursor) {
        this.state.cursor.active = false;
      }
      node.active = true;
      if(node.children){ 
        node.toggled = toggled; 
      }
      this.setState({ cursor: node });
      EventNotify.emit(EVENT_FILE_EXPLORER, node);
  }

  handleClick(e) {
    e.stopPropagation();
  }

  render() {
    return (
       <div>
          <Treebeard
            data={this.state.tree}
            onToggle={this.onToggle}
            decorators = {{...decorators, Header}}
        />
        <RightMenu></RightMenu>
       </div>
    );
  }
}