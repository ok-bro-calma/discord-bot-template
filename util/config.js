module.exports = {
  ram: 512, // well, not all of your ram is used by nodejs, never, people do like to specify it
  token: process.env.token, // bot token
  mongodb: process.env.db, // mongo uri
  prefix: '>',
  owners: [], // no need to put your id, owner/team ids are automatically stored upon start
  // your emojis!
  emoji: {
    tick: '<:check_mark:1076226098175680592>',
    cross: '<:cross_mark:1076226009801699458>',
    queue: '<:queue:1076227108151509074>',
    song: '<:music:1076227387987083274>',
    // you can use strings too like the ones above
    random: () => {
      const emojis = [
        '🕐', '🕐', '🕥', '🕚',
        '🕦', '🕛', '🕧', '🕜',
        '🕑', '🕝', '🕒', '🕞',
        '🕓', '🕟', '🕔', '🕠',
        '🕕', '🕡', '🕖', '🕢',
        '🕗', '🕣', '🕘', '🕤'
      ];
      return emojis[Math.floor(Math.random() * emojis.length)];
    }
  }
};
