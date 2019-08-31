export default {
  LanguageMapping: {
    '.js': 'javascript',
    '.ts': 'typescript',
    '.jsx': 'typescript',
    '.tsx': 'typescript',
    '.html': 'html',
    '.java': 'java',
    '.cpp': 'cpp',
    '.go': 'go', 
    '.php': 'php',
    '.lua': 'lua',
    '.py': 'python',
    '.md': 'markdown',
    '.sql': 'mysql',
    '.css': 'css',
    '.less': 'less',
    '.scss': 'scss',
    '.yaml': 'yaml',
    '.xml': 'xml',
    '.json': 'scheme',
    '.sh': 'powershell'
  },
  getLanguage(ext) {
    return this.LanguageMapping[ext] || 'javascript';
  },
  getLanguageByFile(filepath) {
    const result = filepath.match(/\.([0-9a-z]+$)/i);
    const ext = result && result.length > 0 ? result[0] : '.js';
    return this.getLanguage(ext);
  }
};