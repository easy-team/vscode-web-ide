
import React, { Component, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Layout from '../../framework/layout';
// https://github.com/gaearon/react-hot-loader/issues/525
import { Tab } from './component/tab';
import { TabProps } from '../../framework/type';

class App extends Component<TabProps, any> {
  render() {
    return <Layout {...this.props}><Tab {...this.props} /></Layout>;
  }
}

const root = document.getElementById('app');
if (EASY_ENV_IS_DEV) {
  ReactDOM.render(<AppContainer><Tab message={"Welcome React Web IDE!"} /></AppContainer>, root);
  if (module.hot) {
    module.hot.accept();
  }
} else {
  ReactDOM.render(<Tab message={"Welcome React Web IDE!"} />, root);
}
