module.exports = {
  name: 'memory',
  aliases: ['mem'],
  usage: 'memory',
  description: 'Current memory state for the process at instant',

  run: async (client, message) => {
    const {
      discord: {
        EmbedBuilder
      }
    } = client;
    
    const mem = process.memoryUsage();
    for (const prop in mem) mem[prop] = `${(mem[prop]/1e6).toFixed(2)}MB`; // format a bit

    try {
      await message.reply({
        embeds: [
          new EmbedBuilder()
          .setColor('DarkButNotBlack')
          .addFields(
            {
              name: 'Internal (Code)',
              value: `\`\`\`\n${mem.arrayBuffers}\`\`\``
            },
            {
              name: 'External (Node)',
              value: `\`\`\`\n${mem.external}\`\`\``
            },
            {
              name: 'References Used',
              value: `\`\`\`\n${mem.heapUsed}\`\`\``
            },
            {
              name: 'Total Consumption',
              value: `\`\`\`\n${mem.rss} / ${client.config.ram}MB\`\`\``
            }
          )
        ]
      });
    }
    catch {};
  }
};
