const Discord = require('discord.js'); // import the main package

// construct the client
const client = new Discord.Client({
  intents: Object.values(Discord.GatewayIntentBits).filter(Number), // uses all intents (bad), switch to fewer intents after testing
  // cache options, more info on https://discordjs.guide/miscellaneous/cache-customization.html#limiting-caches
  makeCache: Discord.Options.cacheWithLimits({
    MessageManager: 100,
    GuildMemberManager: {
      maxSize: 1,
      keepOverLimit: (member) => member.id === client.user.id
    }
  }),
  // custom presence
  presence: {
    activities: [{
      name: `v${Discord.version}`,
      type: Discord.ActivityType.Streaming,
      url: 'https://twitch.tv/#'
    }]
  }
});

// hook basic resources and util 
client.fs = require('node:fs');
client.db = require('mongoose');
client.util = require('./util/helper.js');
client.config = require('./util/config.js');

// create collections for data
client.commands = {
  slash: new Discord.Collection(),
  message: new Discord.Collection(),
  aliases: new Discord.Collection()
};
client.prefixes = new Discord.Collection();
client.interactions = new Discord.Collection();

// models
client.container = client.fs.readdirSync('./models').filter(file => file.endsWith('.js'));
for (const model of client.container) require(`./models/${model}`)(client.db);

// interactions
client.container = client.fs.readdirSync('./interactions').filter(file => file.endsWith('.js'));
for (const interaction of client.container) client.interactions.set(
  interaction.split('.')[0],
  require(`./interactions/${interaction}`)
);

// define a function to set commands, both slash and text commands
function setCommand(dir, command) {
  if (command.data) command.data = command.data(Discord).toJSON()
  else if (command.aliases?.length) for (const alias of command.aliases) client.commands.aliases.set(alias, command.name);
  command.category = dir.includes(".") ? "Uncategorized" : dir;
  client.commands[command.data ? "slash" : "message"].set(command.data?.name || command.name, command);
}

// set commands
for (const type of ["slash", "message"]) {
  // filter folders and javascript files only
  const items = client.fs.readdirSync(`./commands/${type}`)
    .filter(item => !item.includes(".") || item.endsWith(".js"));
  for (const item of items) {
    // if its a file
    if (item.includes(".")) {
      setCommand(item, require(`./commands/${type}/${item}`));
      continue;
    }
    // if its a folder
    // filter javascript files in that directory
    const files = client.fs.readdirSync(`./commands/${type}/${item}`).filter(file => file.endsWith(".js"));
    for (const file of files) setCommand(item, require(`./commands/${type}/${item}/${file}));
  }
}

// events
client.container = client.fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const event of client.container) client.on(
  event.split('.')[0],
  // bind 'client' to the event before assignment
  require(`./events/${event}`).bind(null, client)
);

// things you want to do only ONCE, once the bot is ready
client.once(Discord.Events.ClientReady, async () => {
  client.application = await client.application.fetch(); // fetch partial application
  // set commands (slash commands)
  await client.application.commands.set(
    client.commands.slash.map(c => c.data)
  );
  // try to connect to mongodb
  try {
    await client.db.connect(client.config.mongodb);
    console.log(`[mongodb] :: connected :: [${client.util.time()}]`);
  }
  catch(e) {
    console.log(`[mongodb] :: disconnected :: [${client.util.time()}]`);
    console.log(e);
  };
  // add owner ids to config
  if (client.application.owner.members) client.config.owners.push(
    ...client.application.owner.members.keys()
  );
  else client.config.owners.push(client.application.owner.id);
  // check the client status everytime a debug event occurs, kill the process if its down
  client.on(Discord.Events.Debug, () => {
    if (client.isReady()) return;
    client.destroy();
    process.kill(process.pid);
  });
});

delete client.container;

// carry the whole package along and start the bot!
client.discord = Discord;
require('./util/onboot.js')(client);
