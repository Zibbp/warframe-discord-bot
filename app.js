const Discord = require("discord.js");
const snekfetch = require("snekfetch");
const fs = require('fs');
const numeral = require('numeral');

const warframe_api = "https://api.warframestat.us/pc/";
const MAX_ALERTS = 5;

if(!fs.existsSync("./config.json")) {
  console.log("config.json does not exists, bot will not run");
  return 1;
}
const config = require("./config.json");
if(!config.token) {
  console.log("config.json does not contain a bot token (/token in json structure)");
  return 1;
}
if(!config.prefix) {
  console.log("config.json does not contain a command prefix (/prefix in json structure)");
  return 1;
}

const client = new Discord.Client();

function callWarframeAPI(noun) {
  return snekfetch.get(warframe_api + noun)
         .catch(reason => {
           console.log(`${noun} failed with exception: ${reason}`);
         });
}

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setActivity(`${config.prefix}help | In Dev`);
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content[0] !== config.prefix) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === "help") {
    message.author.send({embed: {
      color: 3447003,
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL
      },
      title: "Help command",
      description: "Help and information about the warframe bot.",
      fields: [
        {
          name: "Commands",
          value: `Currently we only have ${config.prefix}time, ${config.prefix}alert, ${config.prefix}void, ${config.prefix}code, and ${config.prefix}farm`
        },
        {
          name: "Development",
          value: "We are constantly adding stuff, view the reddit or github for updates."
        },
        {
          name: "Links",
          value: "[Github](https://github.com/zippy4/warframe-discord-bot)"
        },
        {
          name: "API",
          value: "We use [warframestat.us](https://docs.warframestat.us)"
        }
      ],
      timestamp: new Date(), 
      footer: {
        icon_url: client.user.avatarURL,
      }
    }});
  }

  if(command === "stat") {
    message.channel.send({embed: {
      color: 16716947,
      description: `I am serving ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`
    }}); 
  }

  if(command === "code") {
    message.channel.send({embed: {
      color: 16729344,
      description: `Check out the code over at [Github](https://github.com/zippy4/warframe-discord-bot)`
    }}); 
  }

  if(command === "farm") {
      message.channel.send(`https://youtu.be/60Lci-OcpFw`);
  }
    
  if(command === "void") {
    callWarframeAPI("voidTrader").then(r => {
      var voidTrader = r.body;
      message.channel.send({embed: {
        color: 3447003,
        author: {
          name: voidTrader.character,
          icon_url: client.user.avatarURL
        },
        title: "Location:",
        description: voidTrader.location,
        fields: [{
            name: "Time until arrival",
            value: voidTrader.startString
          }
        ],
      }});
    });
  }

  if(command === "time") {
      callWarframeAPI("cetusCycle").then(r => {
      var isDay = r.body.isDay;
      var timeTillChange = r.body.shortString
      
      // If night
      var color = 0;
      var flavorText = ":first_quarter_moon: It is currently night time, don't go out! :no_entry_sign:";
      var timeUntil = "Time until day:";
      // If day
      if (isDay == true) {
        color = 16776960;
        var flavorText = ":sunny: It is currently day time! Happy fishing! :fish:";
        var timeUntil = "Time until night:";
      }
    
      message.channel.send({embed: {
        color: color,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: "Time for",
        url: "",
        description: "Plains of Eidolon",
        fields: [
          {
            name: "What time is it?",
            value: flavorText
          },
          {
            name: timeUntil,
            value: timeTillChange
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "Warframe Bot | Zippy"
        }
      }});
    });
  }

  if(command === "alert") {
    callWarframeAPI("alerts").then(r => {
      let alerts = r.body;
      
      for (let i = 0; i < alerts.length && i < MAX_ALERTS; i++) {
        let alert = alerts[i];

        message.channel.send({embed: {
          color: 3447003,
          thumbnail: {url: alert.mission.reward.thumbnail},
          title: `${alert.mission.type} - ${alert.mission.node}`,
          description: alert.mission.reward.items.concat(numeral(alert.mission.reward.credits).format('0,0') + "cr").join(" + "),
          fields: [
            {
              name: "Levels",
              value: `${alert.mission.minEnemyLevel}-${alert.mission.maxEnemyLevel}`
            }
          ],
          footer: {
            text: `Timeleft: ${alert.eta}`
          }
        }});
      }
    });

  }

  if(command === "purge") {

    const deleteCount = parseInt(args[0], 10);
    
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
});

client.login(config.token);
