import React, { Component } from 'react';

import io from 'socket.io-client';

import FileExplorer from './widget/FileExplorer';
import CodeEditor from './widget/CodeEditor';
import CodeView from './widget/CodeView';
import TopBar from './widget/TopBar';
import LeftBar from './widget/LeftBar';


import EventNotify from './lib/EventNotify';

import DragIcon from 'asset/images/icon_view_drag.png';

import './index.css';

export default class IDE extends Component {
  constructor(props) {
    super(props);
    this.project= this.props.tree.name;
    this.codeContainer = null;
    this.triggerUpdateTimer = null;
    this.socket = null;
    this.editor = null;
    this.codeEditorRef = React.createRef(),
    this.codeViewRef = React.createRef(),
    this.models = {};
    this.currentTabModel = null;
    this.isSwitchTabAction = true;
    this.state = {
      view:{
        url: ''
      }
    };
  }

  componentDidMount() {
    this.socket = io.connect('http://127.0.0.1:7001/webide');
    this.socket.on("easy-web-ide", data => {
      console.log('>>>receive data:', data);
      this.setViewUrl(data.text);
      EventNotify.emit(EventNotify.EVENT_CODE_VIEW, data);
    });
    this.socket.on('disconnect', data => {
      console.log('>>>disconnect', data);
    });
    this.socket.on('error', data => {
      console.log('>>>error', data);
    });
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    this.setState({width: document.body.clientWidth, height: document.body.clientHeight });
  }


  setViewUrl(text) {
    if (/start webpack web building server/.test(text)) {
      const matches = text.match(/(http[s]?:\/\/([\w-]+.)+([:\d+])?(\/[\w-\.\/\?%&=]*)?)/gi);
      if (matches && matches.length) {
        console.log('---setViewUrl---', matches);
        this.setState({ view: {
          url: matches[0]
        }});
      }
    }
  }


  editorDragResize(e) {}

  editorClickResize() {
    const width = this.codeEditorRef.current.style.width;
    if (!width || width === '60%') {
      this.codeEditorRef.current.style.width = '70%';
      this.codeViewRef.current.style.width = '30%';
    } else if (width === '70%') {
      this.codeEditorRef.current.style.width = '100%';
      this.codeViewRef.current.style.display = 'none';
    } else {
      this.codeEditorRef.current.style.width = '60%';
      this.codeViewRef.current.style.width = '40%';
      this.codeViewRef.current.style.display = '';
    }
  }


  render() {
    return <div className="ide">
      <TopBar project={this.project}></TopBar>
      <div className="editor">
        <LeftBar></LeftBar>
        <div className="editor-file-container">
          <div>
            <FileExplorer tree={this.props.tree}></FileExplorer>
          </div>
        </div>
        <div className="editor-code-and-view-container">
          <div ref={this.codeEditorRef} className="editor-code-editor-container">
            <div className="editor-code-editor-and-btn-drag-container">
              <div className="editor-code-editor-code-container">
                <CodeEditor project={this.project} tree={this.props.tree}></CodeEditor>
              </div>
              <div className="editor-code-editor-btn-container"  onMouseMove={this.editorDragResize.bind(this)}>
                  <img src={DragIcon} width="28" height="28" onClick={this.editorClickResize.bind(this)} />
              </div>
            </div>
          </div>
          <div ref={this.codeViewRef} className="editor-code-view-container">
            <CodeView url={this.state.view.url}></CodeView>
          </div>
        </div>
      </div>
    </div>;
  }
}