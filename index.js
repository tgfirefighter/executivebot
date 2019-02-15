const Discord = require("discord.js");
const botconfig = require("./storage/config.json");
const bot = new Discord.Client({disableEveryone: true});
const ms = require("ms");
const ytdl = require('ytdl-core')

global.currentTeamMembers = [];
global.servers = {};

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setGame("!cmds | !setup");
});

bot.on("guildMemberAdd", member => {
  let joinchannel = member.guild.channels.find(`name`,"logs");
  let bicon = bot.user.displayAvatarURL;

  joinchannel.send(`**Ohh look a new member! : ${member.user}**`);

  let notverified = member.guild.roles.find(`name`,"Not-Verified");
  
  member.addRole(notverified);
});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.defaultprefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1)

  //!botinfo\\
  if(cmd === `${prefix}botinfo`){

    let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setDescription("**Executive Bot Information**")
    .setColor("#FF0000")
    .addField("Bot Name", bot.user.username)
    .setThumbnail(bicon)
    .addField("Executive Bot was Created by whenJack","Main Engineer")
    .addField("If you have any bugs with the bot contact whenJack0#2945","Developer")
    .addField("Created On", bot.user.createdAt)
    .addField("Supporters","Thanks to all my moderators and community manager for there support.")
    .addField("ExecutiveBot Support Discord","https://discord.gg/KAYs3Df")
    .addField("ExecutiveBot Roblox Group","https://www.roblox.com/groups/4734761/ExecutiveBot#!/about")
    .addField("Info requested by", `${message.author}`);


    message.delete().catch(O_o=>{});

    message.channel.send(botembed);
  };
  //See List of commands
  if(cmd === `${prefix}cmds`){
    let sicon = bot.user.displayAvatarURL;
    let cmdembed = new Discord.RichEmbed()
    .setThumbnail(sicon)
    .setDescription("**ExecutiveBot Commands**")
    .setColor("#FF0000")
    .addField("!setup","Run this when you get the bot, this will setup proper permissions, and channels.")
    .addField("!ban [user]","Ban a member from your discord (Administrator)")
    .addField("!kick [user]","Those with manage messages powers can kick a user.")
    .addField("!mute [user] INT-Seconds","Those with manage messages powers can mute a user.")
    .addField("!botinfo","See information on Executive Bot.")
    .addField("!serverinfo","See the information on the server your in.")
    .addField("!report [user] (Reason)","Report a user for bad behavior.")
    .addField("!addrole [user] [rolename]", "Give a user a role with ease.")
    .addField("!removerole [user] [rolename]", "Remove a role from a user with ease.")
    .addField("!ann [announcement]","Send a message to the server!")
    .addField("!purge [number]","Delete a certain number of messages in a channel!")
    .addField("!warn [user] [reason]","Warn a user for innapropriate behavior.")
    .addField("!verify", "This will allow you to use other text channels.") 
    .addField("Info requested by", `${message.author}`);


    message.delete().catch(O_o=>{});

    message.channel.send(cmdembed);


    return;
  }
  if(cmd === `${prefix}serverinfo`){

    let sicon = message.guild.displayAvatarURL;
    let serverembed = new Discord.RichEmbed()
    .setDescription("**Server Information**")
    .setColor("#FF0000")
    .setThumbnail(sicon)
    .addField("Server Name", message.guild.name)
    .addField("Created On", message.guild.createdAt)
    .addField("You Joined", message.member.joinedAt)
    .addField("Total Members", message.guild.memberCount)
    .addField("Info requested by", `${message.author}`);


    message.delete().catch(O_o=>{});
    message.channel.send(serverembed);

    return;
  }

  //report commands
  if(cmd === `${prefix}report`){
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Couldn't find user.");
    let reason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
    .setDescription("**Reports**")
    .setColor("#FF0000")
    .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
    .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
    .addField("Channel", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", reason);

    let reportschannel = message.guild.channels.find('name', "user-reports");
    if(!reportschannel) return message.channel.send("Couldn't find users-reports channel for me to log the report!");



    message.delete().catch(O_o=>{});
    reportschannel.send(reportEmbed);

    return;
  }

  //kick commands
  if(cmd === `${prefix}kick`){
    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return message.channel.send("Couldn't find user.");
    let kReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You do not have proper permissions.")
    if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("That user cannot be kicked.")


    let kickEmbed = new Discord.RichEmbed()
    .setDescription("**~Kick~**")
    .setColor("#FF0000")
    .addField("Kicked User", `${kUser} with ID: ${kUser.id}`)
    .addField("Kicked By", `<@${message.author.id}> with ID ${message.author.id}`)
    .addField("Kicked In", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason",kReason);

    let kickLogs = message.guild.channels.find(`name`,"logs");
    if(!kickLogs) return message.channel.send("logs channel does not exist, I was unable to kick the user. Contact the server owner to create channel logs.");


    message.guild.member(kUser).kick(kReason);
    kickLogs.send(kickEmbed);

    return;
  }
  //ban user
  if(cmd === `${prefix}ban`){
    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return message.channel.send("Couldn't find user.");
    let bReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You do not have proper permissions.")
    if(bUser.hasPermission("ADMINISTRATOR")) return message.channel.send("That user cannot be banned.")


    let banEmbed = new Discord.RichEmbed()
    .setDescription("**~Ban~**")
    .setColor("#FF0000")
    .addField("Banned User", `${bUser} with ID: ${bUser.id}`)
    .addField("Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
    .addField("Banned In", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason",bReason);

    let banlogs = message.guild.channels.find(`name`,"logs");
    if(!banlogs) return message.channel.send("logs channel does not exist, I was unable to ban the user. Contact the server owner to use the !setup command.");


    message.guild.member(bUser).ban(bReason);
    banlogs.send(banEmbed);

    return;
  }
  if(cmd === `${prefix}setup`){
    var server = message.guild;
    var name = message.author.username;
    let notverifyrole = server.roles.find(`name`,"Not-Verified");

    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You do not have the proper permissions.")
    message.channel.send("**Setting up...**")
    if(!server.channels.find(`name`, "logs")) server.createChannel("logs")
    if(!server.channels.find(`name`, "user-reports")) server.createChannel("user-reports")
    if(!server.channels.find(`name`,"verify")) server.createChannel("Verify")
    if(!server.roles.find(`name`,"Not-Verified")) server.createRole({
      name: "Not-Verified",
      color: "#000000",
      permissions:[]
    })
    try{
    server.channels.forEach(async (channel, id) => {
      if(channel.name == "verify"){return;}
      channel.overwritePermissions(notverifyrole, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false
      });
    });
  }catch(e){
    console.log(e.stack);
  }


    if(!server.roles.find(`name`,"Verified")) server.createRole({
      name: "Verified",
      color: "#000000",
      permissions: []
    });

    message.channel.send("**All Setup!**");
    return;
  }
  //Mute Command
  if(cmd === `${prefix}mute`){
    let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!tomute) return message.channel.send("Couldn't find user.");
    if(tomute.hasPermission("MANAGE_MESSAGES"))message.reply("Cannot mute this user!");
    let muterole = message.guild.roles.find(`name`,"muted");
    if(!muterole){
      try{
        //Create mute role
        muterole = await message.guild.createRole({
          name: "muted",
          color: "#000000",
          permissions:[]
        })
        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(muterole, {
            SEND_MESSAGE: false,
            ADD_REACTIONS: false
          });
        });
      }catch(e){
        console.log(e.stack);
      }
    }
    //End of create roles
    //Add role
    let mutetime = args[1];
    if(!mutetime) return message.reply("You need to specify a time, INT.");

    await(tomute.addRole(muterole.id));
    message.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);
    //Giving time
    setTimeout(function(){
      tomute.removeRole(muterole.id);
      message.channel.send(`<@${tomute.id}> has been unmuted.`);
    }, ms(mutetime));
  }
  if(cmd === `${prefix}addrole`){
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("You do not have proper permissions, you must have manage members permission.");
    let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!rMember) return message.reply("Couldn't find that user.")
    let role = args.join(" ").slice(22);
    if(!role) return message.reply("Specify a role!");
    let gRole = message.guild.roles.find(`name`, role);
    if(!gRole) return message.reply("Couldn't find that role.");

    if(rMember.roles.has(gRole.id));
    await(rMember.addRole(gRole.id));

    try{
      await rMember.send(`You were given the role: **${gRole.name}** in server: **${message.guild.name}**`)
    }catch(e){
      message.channel.send(`That user was successfully given role: ${gRole.name}`)
    };
  }
  if(cmd === `${prefix}removerole`){
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("You do not have proper permissions, you must have manage members permission.");
    let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!rMember) return message.reply("Couldn't find that user.")
    let role = args.join(" ").slice(22);
    if(!role) return message.reply("Specify a role!");
    let gRole = message.guild.roles.find(`name`, role);
    if(!gRole) return message.reply("Couldn't find that role.");

    (rMember.removeRole(gRole.id));

    try{
      await rMember.send(`The role: **${gRole.name}** was removed from you in server: **${message.guild.name}**`)
    }catch(e){
      message.channel.send(`You successfully removed the role: ${gRole.name} from that user.`)
    };
  }
  if(cmd === `${prefix}ann`){
    if(!message.member.hasPermission("MANAGE_MESSAGES")) message.reply("You do not have the proper permissions.");
    let announcechannel = message.guild.channels.find(`name`,"announcements");
    if(!announcechannel) message.reply("Announcements channel does not exist.");

    let newannounce = message.content.substr("!ann ".length);

    let announceembed = new Discord.RichEmbed()
    .setDescription("**Announcement**")
    .addField("**Announcement sent by**", `${message.author.username}`)
    .addField("**Announcement**", newannounce)
    .setColor("#FF0000");

    announcechannel.send(announceembed);
  }
  if(cmd === `${prefix}suggest`){
    let bicon = bot.user.displayAvatarURL;
    let yerp = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    let suggestion = message.content.substr("!suggest ".length);
    let suggestchannel = message.guild.channels.find('name', "suggestions");
    if(!suggestchannel) return message.reply("This command is only used in ExecutiveBot support channel.");

    let suggestembed = new Discord.RichEmbed()
    .setDescription("**ExecutiveBot Suggestion**")
    .setColor("#FF0000")
    .addField("**Suggestion**", suggestion)
    .setThumbnail(bicon)
    .addField("**Suggestion made by**", `${message.author.username}`);

    suggestchannel.send(suggestembed);
  }
  if(cmd === `${prefix}purge`){
    if(!message.member.hasPermission("MANAGE_MESSAGES")) message.reply("You do not have the proper permissions.");
    let amountpurge = message.content.substr("!purge ".length);
    message.channel.bulkDelete(amountpurge);
    message.reply(`I have deleted ${amountpurge} messages.`);
  }
  if(cmd === `${prefix}warn`){
    if(!message.member.hasPermission("MANAGE_MEMBERS")) message.reply("You do not have the proper permissions.");
    let warnuser = (message.mentions.users.first()) || message.guild.members.get(args[0]);
    let warnreason = args.join(" ").slice(22);

    message.channel.send(`I have warned ${warnuser} for ${warnreason}.`);
    warnuser.send(`You were warned in: **${message.guild.name}** by user: **${message.author.username}** for: **${warnreason}**`);
  }
  if(cmd === `${prefix}verify`){
    if(message.channel.name == "verify") {
    if(!message.member.roles.find(`name`,"Verified")) message.reply("Verifying.....");
    let verifyrole = message.guild.roles.find(`name`,"Verified");
    let nonverified = message.guild.roles.find(`name`,"Not-Verified");

    message.member.addRole(verifyrole);
    message.member.removeRole(nonverified);
    message.reply("Verified")
    }
  }
});

bot.login(botconfig.token);
