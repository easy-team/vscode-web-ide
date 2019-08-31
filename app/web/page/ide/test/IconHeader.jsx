import React, { Component } from 'react';

export default class Header extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.stopPropagation();
    }

    render() {
        const { node, style } = this.props;
        const iconType = node.children ? 'folder' : 'file-text';
        const iconClass = `fa fa-${iconType}`;
        const iconStyle = {marginRight: '5px'};
        return (
            <div style={style.base}>
                <div style={style.title}>
                    <i className={iconClass} style={iconStyle} />
                    {node.name}
                    <i className="fa fa-download" onClick={this.handleClick} />
                </div>
            </div>
        );
    }
};