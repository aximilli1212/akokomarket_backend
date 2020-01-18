const Request = require("superagent");
const Constants = require("../../common/constants");
const HttpStatus = require("http-status-codes");
const RequestService = require("../../services/request");
const Models = require("../../models");

const SERVER_ADDRESS = 'https://api.hubtel.com/v1/merchantaccount';
const CLIENT_ID = process.env.HUBTEL_TRANSACTION_APP_CLIENT_ID;
const SECRET_KEY = process.env.HUBTEL_TRANSACTION_APP_SECRET;
const ACCOUNT_NUMBER = process.env.HUBTEL_TRANSACTION_APP_ACCOUNT;
const ShortId = require("short-unique-id");
let uuid = new ShortId();

const MD = {

    Receive: (customerName, customerEmail, phone, channel, amount, callbackUrl, localReference, description, token) => {

        return {
            "CustomerName": customerName,
            "CustomerMsisdn": phone,
            "CustomerEmail": customerEmail,
            "Channel": channel,
            "Amount": amount,
            "PrimaryCallbackUrl": callbackUrl,
            "Description": description,
            "Token": token,
            "ClientReference": localReference,
            "FessOnCustomer": false // let user pay for extra charges
        };

    }

};

exports.MD = MD;

function getStatusMessage(code) {

    switch (code) {
        case "0000":
            return "The transaction has been processed successfully";
        case "0001":
            return "Request has been accepted. A callback will be sent on final state";
        case "3008":
            return "Merchant account has not been registered on this channel";
        case "3009":
            return "Merchant account is not available";
        case "4010":
            return "Validation Errors";
        case "4101":
            return "Authorisation for request is denied.";
        case "4103":
            return "Permission denied";
        case "4105":
            return "Authenticated hubtel organisation not owner of specified account number.";
        case "2050":
            return "The MTN Mobile Money user has insufficient funds in wallet to make this payment";
        case "2051":
            return "The mobile number provided is not registered on MTN Mobile Money.";
        case "2001":
            return "Transaction failed due to an error with the Payment Processor. Please review your request or retry in a few minutes";
        case "2100":
            return "The request failed as the customer's phone is switched off.";
        case "2101":
            return "The transaction failed as the PIN entered by the Airtel Money customer is invalid.";
        case "2102":
            return "The Airtel Money user has insufficient funds in wallet to make this payment";
        case "2103":
            return "The mobile number specified is not registered on Airtel Money";
        case "2152":
            return "The mobile number specified is not registered on Tigo cash";
        case "2153":
            return "The amount specified is more than the maximum allowed by Tigo Cash";
        case "2154":
            return "The amount specified is more than the maximum daily limit allowed by Tigo Cash";
        case "2200":
            return "The recipient specified is not registered on Vodafone Cash";
        case "2201":
            return "The customer specified is not registered on Vodafone Cash";
    }

}

function resolveChannel(network) {

    switch (network.toLowerCase()) {
        case "airtel":
            return "airtel-gh";
        case "tigo":
            return "tigo-gh";
        case "vodafone":
            return "vodafone-gh";
        case "mtn":
            return "mtn-gh";
    }

}

exports.resolveChannel  = resolveChannel;

exports.generateReference = function (prefix = "") {
    return `${prefix}-${uuid.randomUUID(12)}`;
};

exports.CALLBACK_URL = `https://${process.env.SERVER_ADDRESS}/payment/hubtel`;

/**
 * Process Transaction
 * @param req
 * @param res
 */
exports.processTransaction = function (req, res) {

    //  Handle response callback for charge transactions
    const body = req.body;
    if(body && body.Data && body.ResponseCode){

        const transactionId = body.Data.TransactionId;

        Models.transactions.findOne({
            where: {
                ref_external : transactionId,
            }
        }).then(txn => {

            //  save meta information about transaction
            if(txn) {

                if( body.ResponseCode === "0000" || body.ResponseCode === "0001" ){
                    txn.setDataValue('status',Constants.TransactionStatus.Succeeded);
                }
                else{
                    txn.setDataValue('status',Constants.TransactionStatus.Failed);
                }

                //  Set Message For Transaction
                txn.setDataValue('message', body.Data.Description );

                //  Set Date Completed
                txn.setDataValue("date_completed", new Date());

                Request.get(SERVER_ADDRESS + '/merchants/' + ACCOUNT_NUMBER + '/transactions/status')
                    .query({  hubtelTransactionId: body.Data.TransactionId })
                    .set('Authorization',`Basic ${new Buffer(`${CLIENT_ID}:${SECRET_KEY}`).toString('base64')}`)
                    .end(function (err, res) {

                        // update metadata for transaction
                        txn.setDataValue('meta', JSON.stringify({
                            CallbackResponse: body,
                            Status: res.body
                        }));

                        //  save changes
                        txn.save().then(() => {

                            return Models.market_request.findOne({
                                where:{
                                    transaction_id: txn.id
                                }
                            }).then(request => {

                                if(txn.getDataValue("status") == Constants.TransactionStatus.Succeeded){
                                    RequestService.onPaymentComplete(request,txn);
                                }
                                else{
                                    RequestService.onPaymentFail(request, getStatusMessage(body.ResponseCode) );
                                }

                            });

                        });

                    });

            }

        });

    }

    //  reply response
    res.status(HttpStatus.NO_CONTENT).end();
};

/**
 * Charge money
 * @param payload
 */
exports.charge = function (payload) {

    return new Promise((resolve,reject) => {

        Request.post(SERVER_ADDRESS + '/merchants/' + ACCOUNT_NUMBER + '/receive/mobilemoney')
            .set('Authorization','Basic ' + new Buffer(`${CLIENT_ID},${SECRET_KEY}`).toString('base64'))
            .send(payload)
            .end(function (err, res) {

                if(err){
                    return reject(err);
                }

                return resolve(res);
            });

    });

};

/**
 * Send money
 * @param payload
 */
exports.send = function (payload) {

    return new Promise((resolve, reject) => {

        Request.post(SERVER_ADDRESS + '/merchants/' + ACCOUNT_NUMBER + '/send/mobilemoney')
            .set('Authorization','Basic ' + new Buffer(`${CLIENT_ID},${SECRET_KEY}`).toString('base64'))
            .set("accept","json")
            .send(payload)
            .end(function (err,res) {

                if (err) {
                    reject(err)
                }
                else {
                    resolve(res);
                }

            });

    });


};

/**
 * Refund money
 */
exports.refund = function () {

};
