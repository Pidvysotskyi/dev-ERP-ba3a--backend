const { transliterate } = require("transliteration");

const transliteration = word => {
  return transliterate(word);
};

module.exports = transliteration;
