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
.sounds
List all the sounds in my library.
\`\`\`
`;

let speech = `
\`\`\`
.say <phrase>
Speak the <phrase> in the voice channel that you're in.
\`\`\`
`;

module.exports = {
  general: general,
  sounds: sounds,
  speech: speech
};
