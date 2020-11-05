const parsedUrl = document.URL.match(/([a-z0-9_-]+.(html)?)$/i);
const docUrl = parsedUrl && parsedUrl.length ? parsedUrl[0] : '';
const _isBackground = /background.*html$/.test(docUrl);

export default function isBackground() {
  return _isBackground;
}
