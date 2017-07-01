export function copy(text) {
  const el = document.createElement('textarea');
  el.setAttribute('id', 'copier');
  el.value = text;
  document.body.appendChild(el); 
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}