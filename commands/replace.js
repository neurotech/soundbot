const rita = require("rita");
const pluralize = require("pluralize");
const config = require("../config");

let getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

let checkLastThreeCharacters = (word, comparison) => {
  if (word.length >= 3) return word.substr(word.length - 3) === comparison;
};

let replacer = (message, words) => {
  var replaced;
  let index = getRandomInt(words.length);
  let word = words[index];
  var newWord = config.word;
  let ing = "ing";
  var isVerb = rita.isVerb(word);
  var isPlural = pluralize.isPlural(word);
  var isPastTense = rita.getPastParticiple(word) === word;
  var isPresentTense = rita.getPresentParticiple(word) === word;
  var endsWithIng = checkLastThreeCharacters(word, ing);

  if (isPlural) newWord = pluralize(config.word);

  if (isVerb && isPastTense) newWord = rita.getPastParticiple(config.word);

  if (isVerb && isPresentTense)
    newWord = rita.getPresentParticiple(config.word);

  if (isVerb && endsWithIng) newWord = config.word + ing;

  replaced = message.replace(word, newWord);

  return replaced;
};

module.exports = message => {
  var letterCount = message.content.length;
  var words = message.content.split(" ");
  var wordCount = words.length;
  var dotStart = message.content.toLowerCase().startsWith(".");

  var diceRoll = getRandomInt(20);
  var success = diceRoll <= 1 && !dotStart && letterCount > 3 && wordCount >= 2;

  if (success) {
    let replacementDone = false;
    let nouns = [];
    let verbs = [];
    let adverbs = [];
    let adjectives = [];

    let messageText = message.content;
    var words = messageText.split(" ");

    words.forEach(word => {
      if (rita.isNoun(word)) nouns.push(word);
      if (rita.isVerb(word)) verbs.push(word);
      if (rita.isAdjective(word)) adjectives.push(word);
      if (rita.isAdverb(word)) adverbs.push(word);
    });

    if (verbs.length > 0 && !replacementDone) {
      messageText = replacer(messageText, verbs);
      replacementDone = true;
    }

    if (nouns.length > 0 && !replacementDone) {
      messageText = replacer(messageText, nouns);
      replacementDone = true;
    }

    if (adjectives.length > 0 && !replacementDone) {
      messageText = replacer(messageText, adjectives);
      replacementDone = true;
    }

    if (adverbs.length > 0 && !replacementDone) {
      messageText = replacer(messageText, adverbs);
      replacementDone = true;
    }

    if (
      replacementDone &&
      nouns.length + verbs.length + adverbs.length + adjectives.length > 0
    )
      return message.channel.send(messageText);
  }
};
