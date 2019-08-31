import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import LogEditor from '../LogEditor';
import LogIcon from 'asset/images/icon_log.png'
import SiteIcon from 'asset/images/icon_site.png'
import './index.css';

export default class CodeView extends Component {
  constructor(props) {
    super(props);
    this.iframeRef = React.createRef();
    this.state = {
      style: {
        displayLog: 'block',
        displayView: 'none'
      }
    };
  }

  componentDidMount() {
    this.iframeRef.current.style.height = (document.body.clientHeight - 80) + 'px';
  }

  viewBarIconClick(text) {
    console.log('bar icon click', text);
    switch (text) {
      case 'log':
        this.setState({
          style: {
            displayLog: 'block',
            displayView: 'none'
          }
        });
        break;
      case 'view':
        this.setState({
          style: {
            displayLog: 'none',
            displayView: 'block'
          }
        });
        break;
      case 'reload':
        this.iframeRef.current.src = this.props.url;
        break;
      case 'browser':
        window.open(this.props.url);
        break;
    }
  }


  render() {
    return <div className="editor-code-view">
      <div className="editor-view-bar theme-dark">
        <div className="editor-view-bar-icon" onClick={this.viewBarIconClick.bind(this, 'log')} ><img src={LogIcon} width="35px" height="35px" /></div>
        <div className="editor-view-bar-icon" onClick={this.viewBarIconClick.bind(this, 'view')}><img src={SiteIcon} width="35px" height="35px" /></div>
        <div className="editor-view-bar-url">{this.props.url}</div>
        <div className="editor-view-bar-icon" onClick={this.viewBarIconClick.bind(this, 'reload')}><Icon type="reload" style={{ fontSize: '24px' }} /></div>
        <div className="editor-view-bar-open" onClick={this.viewBarIconClick.bind(this, 'browser')}><Icon type="right-circle" style={{ fontSize: '24px' }} /></div>
      </div>
      <div>
        <div style={{ 'display': this.state.style.displayLog }}><LogEditor text={this.props.text}></LogEditor></div>
        <iframe style={{ 'display': this.state.style.displayView }} ref={this.iframeRef} src={this.props.url} frameBorder="0" width="100%" height="600px"></iframe>
      </div>
    </div>
  }
}