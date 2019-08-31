import React, { Component } from 'react';
import { Modal, Tabs } from 'antd';
import './index.css';

const { TabPane } = Tabs;
export default class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [{
        name: 'Development',
        tabIndex: 1
      }, {
        name: 'Building',
        tabIndex: 2
      }, {
        name: 'Editor Layout',
        tabIndex: 3
      }],
      activeKey: '1'
    };
  }
  
  switchTab(activeKey) {
    this.setState({ activeKey });
  }

  render() {
    return <Modal 
          visible={this.props.visible}  
          onOk={this.props.handle}
          onCancel={this.props.handle}>
          <Tabs defaultActiveKey={this.state.activeKey} activeKey={this.state.activeKey} onChange={this.switchTab.bind(this)} >
            {
              this.state.tabs.map(tab => (
                <TabPane key={tab.tabIndex} tab={tab.name}>
                  {tab.name}
                </TabPane>
              ))
            }
          </Tabs>
    </Modal>;
  }
}