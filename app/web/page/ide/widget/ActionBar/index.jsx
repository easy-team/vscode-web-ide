import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import Network from '../../lib/Network';
import Setting from '../Setting';
import Create from '../Create';
import './index.css';

export default class ActionBar extends Component {
  constructor(props){
    super(props);
    this.project = this.props.project;
    this.state = {
      settingVisible: false,
      createVisible: false
    }
  }

  execCommand(config) {
    return Network.post(`/api/project/command`, config);
  }

  install() {
    this.execCommand({ action: 'install' , project: this.project });
  }

  run() {
    this.execCommand({ action: 'run' , project: this.project });
  }

  build() {
    this.execCommand({ action: 'build' , project: this.project });
  }

  setting() {
    const settingVisible = !this.state.settingVisible;
    this.setState({ settingVisible });
  }

  create() {
    const createVisible = !this.state.createVisible;
    this.setState({ createVisible });
  }

  render() {
    return <div>
            <div className="top-bar-view">
                <div className="top-bar-view-item" onClick={this.setting.bind(this)}><Icon type="setting" style={{ fontSize: '20px' }}></Icon></div>
                <div className="top-bar-view-item green"><Button type="primary" icon="caret-right" onClick={this.run.bind(this)}>Run</Button></div>
                {/* <div className="top-bar-view-item"><Button type="primary" icon="save">Save</Button></div> */}
                <div className="top-bar-view-item"><Button type="primary" icon="download" onClick={this.install.bind(this)}>Install</Button></div>
                <div className="top-bar-view-item"><Button type="primary" icon="right" onClick={this.build.bind(this)}>Build</Button></div>
                <div className="top-bar-view-item"><Button type="primary" icon="upload" >Upload</Button></div>
                <div className="top-bar-view-item" onClick={this.create.bind(this)}><Button type="primary" icon="plus" >Create</Button></div>
            </div>
            <Setting visible={this.state.settingVisible} handle={this.setting.bind(this)}></Setting>
            <Create visible={this.state.createVisible} handle={this.create.bind(this)}></Create>
        </div>;
  }
}