'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var SQLite = require('sqlite3').verbose();
var Bot = require('slackbots');

var words = [
    "What the fu-la la la la….",
    "Mother Function",
    "Fork my life",
    "Oh, sheep",
    "Oh ship",
    "Heck and double heck",
    "H E double hockey sticks!",
    "Great Scott",
    "Son of a biscut",
    "Aw, duck water",
    "Oh, snap!",
    "Cheeses",
    "Shnookerdookies",
    "Fudge nuggets",
    "Cheese and rice",
    "Sugar",
    "God bless America",
    "Poo",
    "Snickerdoodle",
    "Banana shenanigans",
    "Six and two is eight",
    "God bless it",
    "Barbara Streisand",
    "Fiddlesticks",
    "Jiminy Crickets",
    "Son of a gun",
    "Egad",
    "Great Scott",
    "Caesar’s ghost",
    "Merlin’s beard",
    "Merlin’s pants",
    "Shucks",
    "Darn",
    "Dagnabbit",
    "Dang rabbit",
    "Dadgummit",
    "Jumpin’ Jiminy",
    ];

/**
 * Constructor function. It accepts a settings object which should contain the following keys:
 *      token : the API token of the bot (mandatory)
 *      name : the name of the bot (will default to "shazbot")
 *      dbPath : the path to access the database (will default to "data/norrisbot.db")
 *
 * @param {object} settings
 * @constructor
 *
 * @author Luciano Mammino <lucianomammino@gmail.com>
 */
var ShazBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'Shazbot';

    this.user = null;
    this.db = null;
};

// inherits methods and properties from the Bot constructor
util.inherits(ShazBot, Bot);

/**
 * Run the bot
 * @public
 */
ShazBot.prototype.run = function () {
    ShazBot.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

/**
 * On Start callback, called when the bot connects to the Slack server and access the channel
 * @private
 */
ShazBot.prototype._onStart = function () {
    this._loadBotUser();
    this._firstRunCheck();

};

/**
 * On message callback, called when a message (of any type) is detected with the real time messaging API
 * @param {object} message
 * @private
 */
ShazBot.prototype._onMessage = function (message) {
    if (this._isChatMessage(message) &&
        this._isChannelConversation(message) &&
        this._isMentioningShazBot(message)
    ) {
        this._reply(message);
    }
};

/**
 * Replyes to a message with a random Joke
 * @param {object} originalMessage
 * @private
 */



ShazBot.prototype._reply = function (input) {
    var self = this;
    var channel = self._getChannelById(input.channel);

    var word = words[Math.floor(Math.random() * words.length)];

    self.postMessageToChannel(channel.name, word, {as_user: true});
};

/**
 * Loads the user object representing the bot
 * @private
 */
ShazBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

/**
 * Check if the first time the bot is run. It's used to send a welcome message into the channel
 * @private
 */
ShazBot.prototype._firstRunCheck = function () {
    var self = this;
    self._welcomeMessage();
};

ShazBot.prototype._help = function () {
    this.postMessageToChannel(this.channels[0].name, 'Hi!' +
        '\n Usage: ShazBot <command>' +
        '\n \n where <command> are the following arguments:' +
        '\n {origin}, {destination}, {time of day}',
        {as_user: true});
};

/**
 * Sends a welcome message in the channel
 * @private
 */
ShazBot.prototype._welcomeMessage = function () {
    this.postMessageToChannel(this.channels[0].name, 'Hi!' +
        '\n Just say `ShazBot` to invoke me!',
        {as_user: true});
};

/**
 * Util function to check if a given real time message object represents a chat message
 * @param {object} message
 * @returns {boolean}
 * @private
 */
ShazBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

/**
 * Util function to check if a given real time message object is directed to a channel
 * @param {object} message
 * @returns {boolean}
 * @private
 */
ShazBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C'
        ;
};

/**
 * Util function to check if a given real time message is mentioning ShazBot
 * @param {object} message
 * @returns {boolean}
 * @private
 */
ShazBot.prototype._isMentioningShazBot = function (message) {
    return message.text.toLowerCase().indexOf('shazbot') > -1 ||
        message.text.toLowerCase().indexOf(this.name) > -1;
};

/**
 * Util function to check if a given real time message has ben sent by the ShazBot
 * @param {object} message
 * @returns {boolean}
 * @private
 */
ShazBot.prototype._isFromShazBot = function (message) {
    return message.user === this.user.id;
};

/**
 * Util function to get the name of a channel given its id
 * @param {string} channelId
 * @returns {Object}
 * @private
 */
ShazBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

module.exports = ShazBot;
