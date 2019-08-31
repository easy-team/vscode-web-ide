export default {
  getFileName(filepath) {
    const index = filepath.lastIndexOf('/');
    if (index === -1){
      return filepath;
    }
    return filepath.substring(index + 1);
  }
}