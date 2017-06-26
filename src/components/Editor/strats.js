function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;

  // eslint-disable-next-line no-cond-assign
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

const regs = {
  BOLD: /\*\*.+\*\*/g,
  EM: /\*(?!\*).+?\*/g,
  DEL: /~.*~+/g,
  CODE: /`.*`+/g,
  TAG: /#[\w/]+/g,
  H6: /^#{6}(?!#)\s.+/g,
  H5: /^#{5}(?!#)\s.+/g,
  H4: /^#{4}(?!#)\s.+/g,
  H3: /^#{3}(?!#)\s.+/g,
  H2: /^#{2}(?!#)\s.+/g,
  H1: /^#{1}(?!#)\s.+/g,
};

export const del = (conBlock, cb) => findWithRegex(regs.DEL, conBlock, cb);
export const code = (conBlock, cb) => findWithRegex(regs.CODE, conBlock, cb);
export const strong = (conBlock, cb) => findWithRegex(regs.BOLD, conBlock, cb);
export const em = (conBlock, cb) => findWithRegex(regs.EM, conBlock, cb);
export const tag = (conBlock, cb) => findWithRegex(regs.TAG, conBlock, cb);
export const h6 = (conBlock, cb) => findWithRegex(regs.H6, conBlock, cb);
export const h5 = (conBlock, cb) => findWithRegex(regs.H5, conBlock, cb);
export const h4 = (conBlock, cb) => findWithRegex(regs.H4, conBlock, cb);
export const h3 = (conBlock, cb) => findWithRegex(regs.H3, conBlock, cb);
export const h2 = (conBlock, cb) => findWithRegex(regs.H2, conBlock, cb);
export const h1 = (conBlock, cb) => findWithRegex(regs.H1, conBlock, cb);
