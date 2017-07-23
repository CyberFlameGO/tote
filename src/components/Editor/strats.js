function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;

  // eslint-disable-next-line no-cond-assign
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

export const regs = {
  STRONG: /(\*){2}[^*]+(\*){2}/g,
  EM: /[^*]\*[^*]+\*/g,
  STRONG_EM: /(\*){3}[^*]+(\*){3}/g,
  DEL: /~.*~+/g,
  CODE: /`.*`+/g,
  TAG: /#[\w/]+/g,
};

export const del = (conBlock, cb) => findWithRegex(regs.DEL, conBlock, cb);
export const code = (conBlock, cb) => findWithRegex(regs.CODE, conBlock, cb);
export const strong = (conBlock, cb) => findWithRegex(regs.STRONG, conBlock, cb);
export const em = (conBlock, cb) => findWithRegex(regs.EM, conBlock, cb);
export const strongEm = (conBlock, cb) => findWithRegex(regs.STRONG_EM, conBlock, cb);
export const tag = (conBlock, cb) => findWithRegex(regs.TAG, conBlock, cb);
export const hr = (conBlock, cb) => findWithRegex(regs.HR, conBlock, cb)