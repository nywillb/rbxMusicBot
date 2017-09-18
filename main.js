var Botkit = require('botkit');

var controller = Botkit.slackbot();
var config = require("./config.js");

var bot = controller.spawn({
	token: config.slack_token
});

// slack's api only gives these weird codes instead of usernames :(
var musicChannel = "C753K88NA"

bot.startRTM(function(err,bot,payload) {

	controller.hears([""],'ambient',function(bot, message) {
		if(message.channel == musicChannel) {
			bot.api.reactions.add({
				timestamp: message.ts,
				channel: message.channel,
				name: 'thumbsup',
			});
			bot.api.reactions.add({
				timestamp: message.ts,
				channel: message.channel,
				name: 'thumbsdown',
			});
		};

	});
});
