import { convertFromRaw } from 'draft-js';

export function copy(text) {
  console.log(text);
  const el = document.createElement('textarea');
  el.setAttribute('id', 'copier');
  el.value = text;
  document.body.appendChild(el); 
  el.select();

  // if(document.execCommand('copy')) {
  //   document.body.removeChild(el);
  //   return true;
  // }

  // return false;
}

export function truncate(str, length = 20, append = '...') {
  return str.length < length ? str : str.substr(0, length) + append;
}

export function sort(arr, obj, sortBy) {
  return arr.sort((a, b) => {
    if (obj[a][sortBy] < obj[b][sortBy])
      return 1;
    if (obj[a][sortBy] > obj[b][sortBy])
      return -1;
    return 0;
  });
}

export function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) return `${interval}y`;

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval}m`;

  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval}d`;

  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval}h`;

  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval}m`;

  return Math.floor(seconds) + 's';
}

export function fromRaw(text) {
  return convertFromRaw({
    ...text,
    entityMap: text.entityMap || {},
  });
}