# discord-bot-template
A simple discord bot template based on Discord.js v14.9.0


# Database
This bot uses the mongoose package for handling MongoDB queries<br>

Sample Model File:
```js
// destructure required props from the mongoose package
module.exports = ({ model, Schema }) => model('guild', Schema({
  id: String,
  prefix: { type: String, default: prefix }
}));
```


# Command File Examples
## Text 
```js
module.exports = {
  name: 'command name',
  aliases: ['other names you would like to call this with'], // list
  usage: 'command usage, no need to write the prefix',
  description: 'command description',
  subcommands: {
    add: {
      description: 'subcommand description'
    },
    subtract: {
      description: 'description.'
    }
  },
  
  run: async (client, message, args) => {
    // destructure necessary items
    const {
      config,
      discord: {
        EmbedBuilder // etc
      }
    } = client;
    
    // work with data!
  }
};
```

## Slash
```js
module.exports = {
  // extract required props from discord package
  data: ({ SlashCommandBuilder /*, ChannelType, etc */ }) => new SlashCommandBuilder()
  .setName('command name')
  .setDescription('command description'),
  
  run: async (client, i) => {
    // destructure necessary items
    const {
      config,
      discord: {
        EmbedBuilder // etc
      }
    } = client;
    
    // work with data!
  }
};
```


# Logging
* All errors are logged, eventually you might want to use colors too
* You might also want to customize the time, which is by default set to IST
```js
// util/helper.js
if (!['number', 'string'].includes(typeof s)) {
  const d = new Date(Date.now() + 330 * 60_000); // 330 is your timezone offset to utc in minutes
  const time = [d.getHours(), d.getMinutes(), d.getSeconds()];
  return time.map(t => t < 10 ? `0${t}` : `${t}`).join(':');
};
```


# Replit
* If you're using replit, don't decide to host it permanently there, its a repl not a vps
* Its fine to use it for testing, you shall check out the <a href="https://search.nixos.org/packages">nix store</a> for adding necessary packages to your environment
This is the current configuration
```nix
{ pkgs }: {
  deps = [
    pkgs.nodejs-19_x
    pkgs.nodePackages.typescript-language-server
    pkgs.yarn
    pkgs.replitPackages.jest
    pkgs.python311
    pkgs.ffmpeg_5-full
  ];
}
```
