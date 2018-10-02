const rita = require("rita");
const pluralize = require("pluralize");
const config = require("../config");

let getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

let replacer = (message, words) => {
  let index = getRandomInt(words.length);
  var replacement = isPlural(words[index])
    ? pluralize(config.word)
    : config.word;
  var replaced = message.replace(words[index], replacement);

  // TODO: Check for current/past tense

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
