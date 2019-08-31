export default class EditorService {
	openCodeEditor(input, sideBySide){
		console.log('-----openEditor', input, sideBySide);
		return Promise.resolve({});
	}
	resolveEditor(input, refresh) {
		console.log('resolveEditor', input, refresh);
		return Promise.resolve({});
	}
}