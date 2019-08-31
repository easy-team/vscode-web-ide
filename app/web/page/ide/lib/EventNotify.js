export default {
  EVENT_FILE_EXPLORER: 'event_file_explorer',
  EVENT_FILE_EXPLORER_RIGHT_CLICK: 'event_file_explorer_right_click',
  EVENT_CODE_VIEW: 'event_code_view',
  event: {},
  on(name, fn) {
    if (!this.event[name]) {
      this.event[name] = [];
    }
    this.event[name].push(fn);
  },
  emit(name, data) {
    if (!this.event[name]) {
      console.warn('No');
      return;
    }
    this.event[name].forEach(fn => {
      fn.apply(null, [data]);
    });
  }
}