module.exports = async (client, message) => {
  // text commands, mention response
  (async () => {
    if (!message.guildId || message.author.bot) return;
    const mention = `${client.user}`;
    
    // a reply (preferably bot intro) if the message content only had the bot's mention
    if (message.content.trim() === mention) {
      try {
        // customize this message, don't forget you still have client.discord in case you're looking for the discord package
        await message.reply({
          content: 'Hi'
        });
      }
      catch {};
      return;
    };
    
    // handling the prefix (for multi guild)
    let prefix = client.prefixes.get(message.guildId); // look for it in data, to avoid fetching it unnecessarily
    // exit if the content neither starts with mention, nor the prefix (if the prefix exists)
    if (
      prefix && !message.content.startsWith(prefix)
      && !message.content.startsWith(mention)
    ) return;
    
    // what to do if the prefix is not found?
    if (!prefix && !message.content.startsWith(mention)) {
      prefix = (await client.db.model('guild').findOne({ id: message.guildId }))?.prefix; // undefined or prefix (recall our model)
      if (!prefix) {
        // create a new guild
        const guild = new client.db.model('guild')({
          id: message.guildId
        });
        // save and log errors (if any)
        try {
          await guild.save();
        }
        catch(e) {
          console.log(`[mongodb] :: failed to add new guild :: [${client.util.time()}]`);
          console.log(e);
        };
        prefix = client.config.prefix;
      };
      // saving the prefix to avoid fetching it in future
      client.prefixes.set(message.guildId, prefix);
      if (!message.content.startsWith(prefix)) return;
    };
    
    // slicing the message content as per mention or prefix length
    const content = message.content.slice(
      message.content.startsWith(prefix)
      ? prefix.length
      : mention.length
    ).trim();
    
    // extracting the command
    let command = content
      .split(`\n`)[0]
      .trim()
      .split(/ +/g)[0];
    
    // extracting args (as per command length)
    let args = content
      .slice(command.length)
      .trim()
      .split(/ +/g)
      .filter(Boolean);
    
    // find that command!
    if (!client.commands.message.has(command)) {
      command = client.commands.aliases.get(command);
      if (!command) return;
    };
    command = client.commands.message.get(command);
    
    // handle command permissions if set
    if (command.permissions) {
      const perms = {
        bot: message.channel.permissionsFor(client.user.id).toArray(),
        member: message.channel.permissionsFor(message.author.id).toArray()
      };
      if (command.permissions.bot?.length) {
        if (!command.permissions.bot.every(perm => perms.bot.includes(perm))) return;
      };
      if (command.permissions.member?.length) {
        if (!command.permissions.member.every(perm => perms.member.includes(perm))) return;
      };
    };
    
    // run and log errors (if any)
    try {
      await command.run(client, message, args);
    }
    catch(e) {
      console.log(`[message] :: ${command.name} command error :: [${client.util.time()}]`);
      console.log(e);
    };
  })();
};
