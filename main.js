var Botkit = require('botkit');
var express_webserver = require('express');
var controller = Botkit.slackbot();
var config = require("./config.js");
var request = require('request');

var bot = controller.spawn({
	token: config.token
});

// slack's api only gives these weird codes instead of usernames :(
var musicChannel = config.musicChannel;
var owners = [ "U0EQXEH5W" ];

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
			bot.startTyping(message);
			var songName = message.text.substring('[request] '.length);
			var youtubeAPIURL = "https://www.googleapis.com/youtube/v3/search?q=" + songName + "&part=snippet&key=" + config.youtubeAPIKey;
			
			request(youtubeAPIURL, function (error, response, body) {
				var youtubeResponse = JSON.parse(body);
				if (youtubeResponse.items.length == 0){
					bot.replyInThread(message, "Hmm... I couldn't find any YouTube videos matching that song. You might have to look by yourself")
				} else {
					var videoURL = "http://youtu.be/" + youtubeResponse.items[0].id.videoId;
					var videoURL2 = "http://youtu.be/" + youtubeResponse.items[1].id.videoId;
					var videoURL3 = "http://youtu.be/" + youtubeResponse.items[2].id.videoId;
					songName = songName.replace(" ", "+")
					bot.replyInThread(message, "I found this video that seems to correlate with the song you requested: <" + videoURL +">. If it doesn't, you try <" + videoURL2 + "|this> or <" + videoURL3 + "|this>, or you can try find more results <https://www.youtube.com/results?search_query="+ songName + "|here>");
				}
			}); 
		};
	});

	controller.hears(['shutdown', "goodnight", "good night"],'direct_message,direct_mention,mention',function(bot, message) {
		bot.startConversation(message,function(err, convo) {
			convo.ask('Are you sure you want me to shutdown?',[
				{
					pattern: bot.utterances.yes,
					callback: function(response, convo) {
						if (owners.indexOf(response.user) > -1) {
							convo.say('Nooooo! Don\'t leave me! :cry:');
							convo.next();
							setTimeout(function() {
								process.exit();
							}, 3000);
						} else {
							convo.say("Hey, wait a minute! That's above your pay-grade! Only <@wbarkoff> can turn me off.");
							convo.next();
						}
					}
				},
				{
					pattern: bot.utterances.no,
					default: true,
					callback: function(response, convo) {
						convo.say('*Phew!*');
						convo.next();
					}
				}
			]);
		});
	});
});