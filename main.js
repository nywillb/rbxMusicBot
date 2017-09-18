var Botkit = require('botkit');
var express_webserver = require('express');
var controller = Botkit.slackbot();
var config = require("./config.js");

var bot = controller.spawn({
	token: config.token
});

// slack's api only gives these weird codes instead of usernames :(
var musicChannel = config.musicChannel;


bot.startRTM(function(err,bot,payload) {
	controller.hears([""],'ambient',function(bot, message) {
		if(message.channel == musicChannel && message.text.startsWith("[request]")) {
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