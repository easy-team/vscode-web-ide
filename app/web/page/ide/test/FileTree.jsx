import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';

export default class FileTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeFiles: this.props.files,
    };
  }

  render() {
    return (
      <div>
        <SortableTree
          treeData={this.state.treeFiles}
          onChange={treeFiles => this.setState({ treeFiles })}
          theme={FileExplorerTheme}
        />
      </div>
    );
  }
}