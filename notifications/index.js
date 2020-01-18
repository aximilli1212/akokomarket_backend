const Pusher = require("pusher");

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    encrypted: true
});


/**
 * Broadcast event to channel
 * @param channel The n
 * @param event The name of the event
 * @param data The data to send to the client
 * @param socketId The id of the socket
 */
exports.broadcast = function (channel,event,data, socketId) {
    return pusher.trigger(channel,event,data,socketId);
};

/**
 * Broadcast many events in one http call
 * @param batch
 */
exports.broadcastMany = function (batch) {
    return pusher.triggerBatch(batch);
};