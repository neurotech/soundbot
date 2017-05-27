let general = `
\`\`\`
.list
List all commands
\`\`\`

\`\`\`
.join
Join the voice channel that you're in.
\`\`\`

\`\`\`
.leave
Leave the voice channel that you're in.
\`\`\`
`;

let sounds = `
\`\`\`
.play
Play a sound file in the voice channel that you're in.
\`\`\`

\`\`\`
.randomsound
Play a random sound file in the voice channel that you're in.
\`\`\`

\`\`\`
.sounds
List all the sounds in my library.
\`\`\`
`;

let speech = `
\`\`\`
.sentence
Generate a sentence and send it to the text channel that you made the command from.
\`\`\`

\`\`\`
.ttssentence
Generate a sentence and speak it via TTS to the text channel that you made the command from.
\`\`\`
`;

module.exports = {
  general: general,
  sounds: sounds,
  speech: speech
};
