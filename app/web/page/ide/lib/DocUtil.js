export async function copyTextToClipboard(text) {
  console.log('>>>copy text:', text);
  if (navigator.clipboard) {
    return await navigator.clipboard.writeText(text)
  }
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const ret = document.execCommand('copy');
    document.body.removeChild(textArea);
    return ret;
  } catch (err) {
    console.error('unable to copy', err);
    return false;
  }
}