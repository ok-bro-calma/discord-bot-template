module.exports = {
  name: 'help',
  aliases: ['h'],
  usage: 'help <command_name>',
  description: 'Shows a list of commands available',
  
  run: async (client, message, args) => {
    const {
      config: {
        emoji,
        prefix
      },
      discord: {
        EmbedBuilder
      }
    } = client;

    // show all commands, category-wise, if no command is specified
    if (!args.length) {
      let commands = client.commands.message.reduce((t, c) => {
        try {
          t.find(i => i.name === c.category).value += `, ${c.name}`;
        }
        catch {
          t.push({
            name: c.category,
            value: c.name
          });
        };
        return t;
      }, []);
      commands = commands.map(c => {
        c.value = `\`\`\`\n${c.value}\`\`\``;
        return c;
      });
      try {
        await message.reply({
          embeds: [
            new EmbedBuilder()
            .setColor('Yellow')
            .addFields(commands)
          ]
        });
      }
      catch {};
      return;
    };
    
    // find the command, return with a note if it doesn't exist
    let command = args[0].toLowerCase();
    if (!client.commands.message.has(command)) command = client.commands.aliases.get(command);
    if (!command) {
      try {
        await message.reply({
          embeds: [
            new EmbedBuilder()
            .setColor('Red')
            .setTitle(`${emoji.cross} That command doesn't exist`)
          ]
        })
      }
      catch {};
      return;
    };
    command = client.commands.message.get(command);

    // look for subcommands
    if (args[1]) {
      const subcommand = args[1].toLowerCase();
      if (!command.subcommands) {
        try {
          await message.reply({
            embeds: [
              new EmbedBuilder()
              .setColor('Red')
              .setTitle(`${emoji.cross} That command has no subcommands`)
            ]
          })
        }
        catch {};
        return;
      };
      
      // return with a note if that subcommand doesn't exist for that command
      if (!Object.keys(command.subcommands).includes(subcommand)) {
        try {
          await message.reply({
            embeds: [
              new EmbedBuilder()
              .setColor('Red')
              .setTitle(`${emoji.cross} That subcommand does not exist for this command`)
            ]
          });
        }
        catch {};
        return;
      };
      
      // send the subcommand description
      try {
        await message.reply({
          embeds: [
            new EmbedBuilder()
            .setColor('DarkButNotBlack')
            .setTitle(`${command.name} > ${subcommand}`)
            .setDescription(command.subcommands[subcommand].description)
          ]
        });
      }
      catch {};
      return;
    };
    
    
    // send the command info
    try {
      await message.reply({
        embeds: [
          new EmbedBuilder()
          .setColor('DarkButNotBlack')
          .setTitle('Command </>')
          .addFields([
            {
              name: 'Name',
              value: `\`\`\`\n${command.name}\`\`\``
            },
            command.usage ? ({
              name: 'Usage',
              value: `\`\`\`\n${prefix.get(message.guildId) + command.usage}\`\`\``
            }) : null,
            command.aliases?.length ? ({
              name: 'Aliases',
              value: `\`\`\`\n${command.aliases.join(', ')}\`\`\``
            }) : null,
            {
              name: 'Category',
              value: `\`\`\`\n${command.category}\`\`\``
            },
            command.description ? ({
              name: 'Description',
              value: `\`\`\`\n${command.description}\`\`\``
            }) : null,
            command.permissions?.member?.length ? ({
              name: 'Additional Perms',
              value: `\`\`\`\n${command.permissions?.member?.join(', ')}\`\`\``
            }) : null
          ].filter(Boolean))
        ]
      });
    }
    catch {};
  }
};
