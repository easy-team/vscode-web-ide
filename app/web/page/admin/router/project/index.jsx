import React, { Component } from 'react';
import { Table } from 'antd';

export default class Project extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      columns : [
        {
          title: '项目名称',
          dataIndex: 'name'
        },
        {
          title: '项目类型',
          className: 'project-type',
          dataIndex: 'type',
        },
        {
          title: '项目开发',
          dataIndex: 'path',
          render: text => <a target="_blank" href={"/ide?project=" + text }>{text}</a>,
        },
      ],  
      projectlist: []
    }
  }

  componentWillMount() {
    fetch('/api/project/list').then(function(response) {
      return response.json();
    }).then(json => {
      const data = json.list.map((project, index) => {
        return {
          key: index,
          name: project,
          type: 'React',
          path: project
        }
      });
      this.setState({ projectlist: data });
    });
  }

  changePage(page){
    this.setState({ current: page,}, () => {})
  }

  render() {
    
    return <Table
            bordered
            columns={this.state.columns}
            dataSource={this.state.projectlist}
            pagination={{ 
              current: 1,
              pageSize: 10,
              total: 50,
              onChange: this.changePage,
            }}
          />;
  }
}
