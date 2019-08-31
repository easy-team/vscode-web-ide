import React, { Component } from 'react';
import * as monaco from 'monaco-editor';
import { Icon, Tabs } from 'antd';
import io from 'socket.io-client';
import MonacoConfig from '../../lib/MonacoConfig';
import MonacoEditor from '../../lib/MonacoEditor';
import MonacoUtil from '../../lib/MonacoUtil';
import MonacoEditorService from '../../lib/EditorService';
import EventNotify from '../../lib/EventNotify';
import Network from '../../lib/Network';

const { TabPane } = Tabs;
const closeStyle = {
  position: 'absolute',
  top: 8,
  right: -9
};

let tabIndex = 0;
export default class CodeEditor extends Component {
  constructor(props) {
    super(props);
    this.project = this.props.project;
    this.tree = this.props.tree;
    this.tabModels = {};
    this.editor = null;
    this.editorRef = React.createRef(),
    this.codeContainer = null;
    this.triggerUpdateTimer = null;
    this.currentTabModel = null;
    this.isSwitchTabAction = true;
    this.state = {
      tabs: [{
        name: 'Welcome',
        filepath: 'easy-web-ide-default-model',
        tabIndex: String(tabIndex)
      }],
      activeKey: String(tabIndex)
    };
  }

  componentDidMount() {
    MonacoEditor.initialize();
    this.createEditor(this.editorRef.current);
    this.initEditor();
    this.resizeEditor();
    EventNotify.on(EventNotify.EVENT_FILE_EXPLORER, data => {
      this.onFileClick(data);
    });
    
    window.addEventListener("resize", () => {
      this.resizeEditor();
    });
  }

  resizeEditor() {
    this.editorRef.current.style.height = (document.body.clientHeight - 86) + 'px';
  }

  initEditor() {
    // init web editor
    const code = 'console.log("Web IDE")';
    const language = 'javascript';
    const filepath = 'easy-web-ide-default-model';
    const model = monaco.editor.createModel(code, language, monaco.Uri.from({
      scheme: 'file',
      path: filepath
    }));
    this.currentTabModel = { tab: { name: 'Welcome', filepath, tabIndex: '0' }, editor: { model, code, language } };
    this.tabModels[filepath] = this.currentTabModel;
    this.editor.setModel(model);
    window.model = model;
  }

  createEditor(editorContainer, editorOptions = {}) {
    this.editor = monaco.editor.create(editorContainer, {
      theme: 'vs-dark',
      language: 'scheme',
      scrollBeyondLastLine: false,
      automaticLayout: true,
      ...editorOptions
    });
    // go to Definition https://github.com/Microsoft/monaco-editor/issues/291
    const codeEditorService = this.editor._codeEditorService;
    codeEditorService.openCodeEditor = ({resource, options}) => {
      const filepath = resource.path;
      this.createFileTab({
        name: MonacoUtil.getFileName(filepath),
        filepath: filepath.replace(/^\//, '')
      });
    }
    this.editor.onDidChangeModelContent((event) => {
      console.log('----edit onDidChangeModelContent----');
      if (!this.triggerUpdateTimer) {
        this.triggerUpdateTimer = setTimeout(() => {
          this.updateCode();
          this.triggerUpdateTimer = null;
        }, 1000);
      }
    });
    // ctrl + save 
    this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
      this.updateCode();
      console.log('SAVE pressed!');
    });
    // command + save
    this.editor.addCommand(monaco.KeyMod.WinCtrl | monaco.KeyCode.KEY_S, () => {
      this.updateCode();
      console.log('SAVE pressed!');
    });
    window.editor = this.editor;
  }

  async updateCode() {
    console.log('----edit update code----');
    // need combine change submit
    const code = this.editor.getValue();
    const { name, filepath } = this.currentTabModel.tab;
    // this.currentTabModel.editor.code = code;
    // this.currentTabModel.editor.model.setValue(code);
    Network.post('/api/project/file/save', { project: this.project, name, filepath, code });
  }

  async fetchCode(project, filepath) {
    return fetch(`/api/project/file/read?project=${project}&filepath=${filepath}`).then(response => {
      return response.json();
    })
  }

  switchTab(activeKey) {
    // see https://github.com/Microsoft/monaco-editor/issues/604
    // save tab view state
    console.log('>>activeKey', activeKey, this.state.activeKey);
    console.log('>>currentTab', this.currentTabModel);
    console.log('>>models', this.tabModels);
    if (this.isSwitchTabAction && this.state.activeKey !== activeKey) {
      const currentTab = this.currentTabModel.tab;
      this.tabModels[currentTab.filepath].editor.model = this.editor.getModel();
      this.tabModels[currentTab.filepath].editor.state = this.editor.saveViewState();

      // restore selected tab
      this.setState({ activeKey });
      const tab = this.state.tabs.find(tab => {
        return tab.tabIndex === activeKey;
      });
      console.log('>>>tab', tab);
      this.currentTabModel = this.tabModels[tab.filepath];
      this.editor.setModel(this.currentTabModel.editor.model);
      this.editor.restoreViewState(this.currentTabModel.editor.state);
      this.editor.focus();
    }
    this.isSwitchTabAction = true;
  }

  async createFileTab(node) {
    const language = MonacoConfig.getLanguageByFile(node.name);
    console.log('>>>language', language);
    tabIndex++;
    const tab = {
      name: node.name,
      filepath: node.filepath,
      tabIndex: String(tabIndex)
    };
    this.setState({
      tabs: this.state.tabs.concat(tab),
      activeKey: String(tabIndex),
    });
    if (this.tabModels[tab.filepath]) {
      const tabModel = this.tabModels[tab.filepath];
      // reference model code
      if (tabModel.editor.code === null ){
        const { code } = await this.fetchCode(this.project, tab.filepath);
        tabModel.editor.code = code;
        tabModel.editor.model.setValue(code);
      }
      // preload tab model
      if (tabModel.tab === null) {
        tabModel.tab = tab;
      }
      this.editor.setModel(tabModel.editor.model);
      this.editor.focus();
    } else {
      const { code, imports } = await this.fetchCode(this.project, tab.filepath);
      await this.loadReferenceImportModelFile(imports, { project: this.project, filepath: node.filepath });
      const model = monaco.editor.createModel(code, language, monaco.Uri.from({
        scheme: 'file',
        path: tab.filepath
      }));
      const tabModel = { tab, editor: { model, language, code } };
      this.currentTabModel = tabModel;
      this.tabModels[tab.filepath] = tabModel;
      this.editor.setModel(model);
      this.editor.focus();
    }
  }

  async loadReferenceImportModelFile(imports, options) {
    const importModules = imports.map(importModule => {
      return importModule.source;
    });
    const resolveImportModules = await Network.post('/api/project/file/resolve', { ...options, importModules });
    resolveImportModules.forEach(resolveImportModule => {
      if (resolveImportModule) {
        const { importModule, filepath, code, node_modules } = resolveImportModule;
        console.log('>>>filepath', node_modules, importModule, filepath);
        const language = MonacoConfig.getLanguageByFile(filepath);
        // if not exist file model, create file model
        if (!this.tabModels[filepath]) {
          if (node_modules) {
            monaco.languages.typescript.javascriptDefaults.addExtraLib(code, filepath);
          }
          const model = monaco.editor.createModel(code, language, monaco.Uri.from({
            scheme: 'file',
            path: filepath
          }));
          this.tabModels[filepath] = { tab: null, editor: { model, language, code } };;
        }
      }
    })
  }


  onFileClick(node) {
    if (!node.directory) {
      const tab = this.state.tabs.find(tab => {
        return tab.filepath === node.filepath;
      });
      if (tab) {
        this.setState({ activeKey: tab.tabIndex });
        this.currentTabModel = this.tabModels[node.filepath];
        this.editor.setModel(this.currentTabModel.editor.model);
        this.editor.restoreViewState(this.currentTabModel.editor.state);
        this.editor.focus();
      } else {
        this.createFileTab(node);
      }
    }
  }

  remove(tabIndex) {
    this.isSwitchTabAction = false;
    const tabs = this.state.tabs;
    const index = tabs.findIndex(tab => {
      return tab.tabIndex === tabIndex
    });

    tabs.splice(index, 1);
    if (this.state.activeKey === tabIndex) {
      const nextIndex = index > 0 ? index - 1 : 0;
      if (tabs.length) {
        this.setState({
          tabs,
          activeKey: tabs[nextIndex].tabIndex
        });
        const filepath = tabs[nextIndex].filepath;
        this.currentTabModel = this.tabModels[filepath];
        this.editor.setModel(this.currentTabModel.editor.model);
        this.editor.restoreViewState(this.currentTabModel.editor.state);
        this.editor.focus();
      } else {
        this.setState({
          tabs
        });
        this.editor.setModel(null);
        this.editor.restoreViewState(null);
        this.currentTabModel = null;
      }
    } else {
      this.setState({
        tabs
      });
    }
  }


  render() {
    return <div>
          <div className="editor-code-tab">
            <Tabs defaultActiveKey={this.state.activeKey} activeKey={this.state.activeKey} onChange={this.switchTab.bind(this)} >
              {
                this.state.tabs.map(tab => (
                  <TabPane key={tab.tabIndex} tab={
                    <div>
                      {tab.name}<Icon type="close" style={closeStyle} onClick={this.remove.bind(this, tab.tabIndex)} />
                    </div>
                  }></TabPane>
                ))
              }
            </Tabs>
          </div>
          <div ref={this.editorRef} id="easy-web-ide-editor" className="editor-code"></div>
      </div>;
  }
}