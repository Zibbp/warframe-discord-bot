const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
client.on("ready", () => {
  
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setActivity(`+help | In Dev`);
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`+help | In Dev`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`+help | In Dev`);
});

client.on("message", async message => {

  if(message.author.bot) return;

  if(message.content.indexOf(config.prefix) !== 0) return;

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
    fields: [{
        name: "Commands",
        value: "Currently we only have +time and +alert"
      },
      {
        name: "Development",
        value: "We are constantly adding stuff, view the reddit or github for updates."
      },
      {
        name: "Links",
        value: "[Github](http://google.com) and [Github](http://google.com)"
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
  }
});
  }

 if(command === "void") {
  const api = "https://api.warframestat.us/pc"
  const snekfetch = require("snekfetch")
    snekfetch.get(api).then(r => {
      var voidTrader = r.body.voidTrader
      message.channel.send({embed: {
    color: 3447003,
    author: {
      name: voidTrader.character,
      icon_url: client.user.avatarURL
    },
    title: "Location:",
    description: voidTrader.location,
    fields: [{
        name: "Time until departure",
        value: voidTrader.endString
      }
    ],
  }
});
    });
  }

  if(command === "time") {
  const api = "https://api.warframestat.us/pc/cetusCycle"
  const snekfetch = require("snekfetch")
    snekfetch.get(api).then(r => {
      var body = r.body.isDay;
      var shortString = r.body.shortString
    if (body == true) {
      message.channel.send({embed: {
    color: 16776960,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: "Time for",
    url: "",
    description: "Plains of Eidolon",
    fields: [{
        name: "What time is it?",
        value: ":sunny: It is currently day time! Happy fishing! :fish:"
      },
      {
        name: "Time until night:",
        value: shortString
      }
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "Warframe Bot | Zippy"
    }
  }
});
    }else
      message.channel.send({embed: {
    color: 0,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: "Time for",
    url: "",
    description: "Plains of Eidolon",
    fields: [{
        name: "What time is it?",
        value: ":first_quarter_moon: It is currently night time, don't go out! :no_entry_sign:"
      },
      {
        name: "Time until day:",
        value: shortString
      }
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "Warframe Bot | Zippy"
    }
  }
});
    });
  }

  if(command === "alert") {
  const api = "https://api.warframestat.us/pc/alerts"
  const snekfetch = require("snekfetch")
    snekfetch.get(api).then(r => {
      var alert1 = r.body[0];
      var alert2 = r.body[1];
      var alert3 = r.body[2];
      var alert4 = r.body[3];
      var alert5 = r.body[4];
      message.channel.send({embed: {
    color: 3447003,
    author: {
      name: "Alert #1",
      icon_url: alert1.mission.reward.thumbnail
    },
    title: `Type: ${alert1.mission.type}`,
    description: alert1.mission.node,
    fields: [{
        name: "Loot",
        value: alert1.mission.reward.asString
      },
      {
        name: "Min Enemy Level",
        value: alert1.mission.minEnemyLevel
      },
      {
        name: "Max Enemy Level",
        value: alert1.mission.maxEnemyLevel
      }
    ],
    footer: {
      icon_url: alert1.mission.reward.thumbnail,
      text: `Timeleft: ${alert1.eta}`
    }
  }
});



message.channel.send({embed: {
    color: 3447003,
    author: {
      name: "Alert #2",
      icon_url: alert2.mission.reward.thumbnail
    },
    title: `Type: ${alert2.mission.type}`,
    description: alert2.mission.node,
    fields: [{
        name: "Loot",
        value: alert2.mission.reward.asString
      },
      {
        name: "Min Enemy Level",
        value: alert2.mission.minEnemyLevel
      },
      {
        name: "Max Enemy Level",
        value: alert2.mission.maxEnemyLevel
      }
    ],
    footer: {
      icon_url: alert2.mission.reward.thumbnail,
      text: `Timeleft: ${alert2.eta}`
    }
  }
});


message.channel.send({embed: {
    color: 3447003,
    author: {
      name: "Alert #3",
      icon_url: alert3.mission.reward.thumbnail
    },
    title: `Type: ${alert3.mission.type}`,
    description: alert3.mission.node,
    fields: [{
        name: "Loot",
        value: alert3.mission.reward.asString
      },
      {
        name: "Min Enemy Level",
        value: alert3.mission.minEnemyLevel
      },
      {
        name: "Max Enemy Level",
        value: alert3.mission.maxEnemyLevel
      }
    ],
    footer: {
      icon_url: alert3.mission.reward.thumbnail,
      text: `Timeleft: ${alert3.eta}`
    }
  }
});


message.channel.send({embed: {
    color: 3447003,
    author: {
      name: "Alert #4",
      icon_url: alert4.mission.reward.thumbnail
    },
    title: `Type: ${alert4.mission.type}`,
    description: alert4.mission.node,
    fields: [{
        name: "Loot",
        value: alert4.mission.reward.asString
      },
      {
        name: "Min Enemy Level",
        value: alert4.mission.minEnemyLevel
      },
      {
        name: "Max Enemy Level",
        value: alert4.mission.maxEnemyLevel
      }
    ],
    footer: {
      icon_url: alert4.mission.reward.thumbnail,
      text: `Timeleft: ${alert4.eta}`
    }
  }
});


message.channel.send({embed: {
    color: 3447003,
    author: {
      name: "Alert #5",
      icon_url: alert5.mission.reward.thumbnail
    },
    title: `Type: ${alert5.mission.type}`,
    description: alert5.mission.node,
    fields: [{
        name: "Loot",
        value: alert5.mission.reward.asString
      },
      {
        name: "Min Enemy Level",
        value: alert5.mission.minEnemyLevel
      },
      {
        name: "Max Enemy Level",
        value: alert5.mission.maxEnemyLevel
      }
    ],
    footer: {
      icon_url: alert5.mission.reward.thumbnail,
      text: `Timeleft: ${alert5.eta}`
    }
  }
});

});

  }

  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
});

client.login(config.token);
           