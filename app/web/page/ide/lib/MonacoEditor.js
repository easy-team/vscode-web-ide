import * as monaco from 'monaco-editor';
import MonacoConfig from './MonacoConfig';

export default class MonacoEditor {
  
  static initialize() {
    this.initializeEnvironment();
    this.initializeLayout();
  }

  static initializeEnvironment() {
    window.MonacoEnvironment = {
      getWorkerUrl: function (moduleId, label) {
        console.log(label, EASY_ENV_PUBLIC_PATH);
        if (label === 'json') {
          return `${EASY_ENV_PUBLIC_PATH}json.worker.js`;
        }
        if (label === 'css') {
          return `${EASY_ENV_PUBLIC_PATH}css.worker.js`;
        }
        if (label === 'html') {
          return `${EASY_ENV_PUBLIC_PATH}html.worker.js`;
        }
        if (label === 'typescript' || label === 'javascript') {
          return `${EASY_ENV_PUBLIC_PATH}typescript.worker.js`;
        }
        return `${EASY_ENV_PUBLIC_PATH}editor.worker.js`;
      }
    }
  }

  static initializeLayout() {
    // https://microsoft.github.io/monaco-editor/playground.html#customizing-the-appearence-exposed-colors
    monaco.editor.defineTheme('easy-web-ide-theme', {
      base: 'vs',
      inherit: false,
      rules: [
        { token: 'custom-info', foreground: '808080' },
        { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
        { token: 'custom-notice', foreground: 'FFA500' },
        { token: 'custom-date', foreground: '008800' },
      ]
    });
    monaco.editor.setTheme('easy-web-ide-theme');
    // monaco.languages.setLanguageConfiguration('typescript', {});
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      // noLib: true,
      allowJs: true,
      allowNonTsExtensions: true,
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      target: monaco.languages.typescript.ScriptTarget.ES5
    });
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      // noLib: true,
      allowJs: true,
      allowNonTsExtensions: true,
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      target: monaco.languages.typescript.ScriptTarget.ES5
    });
    return monaco;
  }
}