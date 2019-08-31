import React, { Component } from 'react';
import * as monaco from 'monaco-editor';
import EventNotify from '../../lib/EventNotify';
import './index.css';

export default class LogEditor extends Component {
  constructor(props) {
    super(props);
    this.editor = null;
    this.logEditorRef = React.createRef();
    this.text = ''
  }

  componentDidMount() {
    this.logEditorRef.current.style.height = (document.body.clientHeight - 86) + 'px';
    // https://microsoft.github.io/monaco-editor/playground.html#customizing-the-appearence-exposed-colors
    monaco.editor.defineTheme('easy-web-ide-theme', {
      base: 'vs',
      inherit: false,
      rules: [
        { token: 'custom-info', foreground: '808080' },
        { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
        { token: 'custom-notice', foreground: 'FFA500' },
        { token: 'custom-date', foreground: '008800' },
        { token: 'custom-tip', foreground: '008800' },
      ]
    });
    monaco.editor.setTheme('easy-web-ide-log-theme');
    monaco.languages.register({ id: 'mySpecialLanguage' });

    // Register a tokens provider for the language
    monaco.languages.setMonarchTokensProvider('LogTextLanguage', {
      tokenizer: {
        root: [
          [/\[error.*/, "custom-error"],
          [/\[notice.*/, "custom-notice"],
          [/\[info.*/, "custom-info"],
          [/\[[a-zA-Z 0-9:]+\]/, "custom-date"],
          [/\[webpack-tool.*/, "custom-tip"],
        ]
      }
    });

    // Register a completion item provider for the new language
    monaco.languages.registerCompletionItemProvider('LogTextLanguage', {
      provideCompletionItems: () => {
        var suggestions = [{
          label: 'simpleText',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'simpleText'
        }, {
          label: 'testing',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'testing(${1:condition})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        }, {
          label: 'ifelse',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: [
            'if (${1:condition}) {',
            '\t$0',
            '} else {',
            '\t',
            '}'
          ].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'If-Else Statement'
        }];
        return { suggestions: suggestions };
      }
    });
    this.editor = monaco.editor.create(this.logEditorRef.current, {
      value: this.props.text,
      theme: 'vs-dark',
      scrollBeyondLastLine: false,
      automaticLayout: true, 
      minimap: {
        enabled: false
      }
    });


    this.editor.addAction({
      id: 'easy-web-ide-view-log-clear',
      label: 'Clear All',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_E
      ],
      keybindingContext: null,
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run: (editor) => {
        this.text = '';
        this.editor.setValue(this.text);
      }
    });
   
    // update view log
    EventNotify.on(EventNotify.EVENT_CODE_VIEW, data => {
      this.text += data.text;
      this.editor.setValue(this.text);
    });
    window.addEventListener("resize", () => {
      this.resizeEditor();
    });
    this.resizeEditor();
  }

  resizeEditor() {
    this.logEditorRef.current.style.height = (document.body.clientHeight - 86) + 'px';
  }

  render() {
    return <div ref={this.logEditorRef} id="easy-web-ide-view-log"></div>;
  }
};