import React, { Component } from 'react';
import * as monaco from 'monaco-editor';

import './index.css';

export default class IDE extends Component {
  componentDidMount() {
    window.MonacoEnvironment = {
      getWorkerUrl: function (moduleId, label) {
        if (label === 'json') {
          return './json.worker.bundle.js';
        }
        if (label === 'css') {
          return './css.worker.bundle.js';
        }
        if (label === 'html') {
          return './html.worker.bundle.js';
        }
        if (label === 'typescript' || label === 'javascript') {
          return './ts.worker.bundle.js';
        }
        return './editor.worker.bundle.js';
      }
    }
    monaco.editor.create(document.getElementById('container'), {
      value: [
        'function x() {',
        '\tconsole.log("Hello world!");',
        '}'
      ].join('\n'),
      theme: 'vs-dark',
      language: 'javascript'
    });
  }

  render() {
    return <div id="container" className="ide"></div>;
  }
}