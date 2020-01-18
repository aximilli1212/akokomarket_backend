const _ = require("lodash");
const notification = require("../notifications");
const Channels = require("../notifications/channels");
const Events = require("../notifications/events");
const Serializer = require("sequelize-json-serializer");
const Models = require("../models");
const mailer = require("./mailer");
const Constants = require("../common/constants");

exports.onSubmitBfarmsRequest = async function (request) {

    const admin = await Models.users.findAll({
        where: {
            enable_notification: true,
            account_type: Constants.UserAccountTypes.Admin
        }
    });

    if (admin.length > 0)
        await mailer.sendEmailTemplate('new_bfarms_request', admin.map(c => c.email), "New B's Farm Request", {
            phone: request.phone || "N/A",
            location: request.location || "N/A",
            item: request.option,
        });



};


/**
 * On market request created
 * @param request
 * @param customer
 */
exports.onRequestCreated = async function (request,customer) {

    try {
        const admin = await Models.users.findAll({
            where: {
                enable_notification: true,
                account_type: Constants.UserAccountTypes.Admin
            }
        });

        if (admin.length > 0)
            await mailer.sendEmailTemplate('new_market_request', admin.map(c => c.email), 'New Market Request', {
                name: customer.fullname || "N/A",
                phone: customer.phone || "N/A",
                location: customer.location || "N/A",
                item: request.item,
                cost: request.cost.toLocaleString(undefined),
                time: `${request.date_created.toLocaleDateString()} ${request.date_created.toLocaleTimeString()}`
            });


        //  broadcast event
        notification.broadcast(Channels.Requests, Events.generic.create, {
            request: Serializer.serialize(request, Models.market_request, {
                tags: ["notification", "default"],
                include: {all: true}
            })
        });

    }
    catch (err){
        console.error('Failed sending mail\r\n' ,err);
    }

};

/**
 * Payment Successful
 */
exports.onPaymentComplete = function (request , transaction ) {

    notification.broadcast( Channels.Payment , Events.payment.paid , {
        amount: transaction.actual_amount,
        request: Serializer.serialize(request,Models.market_request,{
            tags: [ "notification" , "default" ],
            include: { all: true }
        }),

    });

};

/**
 * Payment Failed
 */
exports.onPaymentFail = function () {

    //  Log payment failure

};