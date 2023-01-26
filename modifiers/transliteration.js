const translit = require("ua-en-translit");

const transliteration = word => {
  return translit(word);
};

module.exports = transliteration;
