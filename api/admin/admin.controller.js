const _ = require("lodash");
const Controller = require("../../common/controller").Controller;
const Sequelize = require("sequelize");
const Serializer = require("sequelize-json-serializer");
const HttpStatus = require("http-status-codes");
const utils = require("../../common/utils");
const Constants = require("../../common/constants");
const Password = require("../../common/password");
const Authentication = require("../../auth");
const Models = require("../../models");
const ValidationError = require("../../errors/Validation");

const UserSchema = {

    fields: [
        'username',
        'first_name',
        'last_name',
        'email',
        'company_id',
        'phone',
        'account_type',
        'date_created',
        'last_updated',
        'enable_notification'
    ]

};

Serializer.defineSchema(Models.users , UserSchema);

Serializer.defineSchema(Models.users  , {

    fields: [
        'username',
        'first_name',
        'last_name',
        'email',
        'company_id',
        'phone'
    ]

}, "notification");

class AdminController extends Controller{

    constructor(){
        super('Admin',Models.users);
    }

    getDashboardStats(req,res){

        const stats = {

            market_requests:{
                total: 0,
                delivered: 0,
                today: 0,
                yesterday: 0,
                week: 0,
                month: 0
            },

            customers: {
                total: 0,
                today: 0,
                yesterday: 0,
                week: 0,
                month: 0
            },

            depot: {
                total: 0,
                today: 0,
                yesterday: 0,
                week: 0,
                month: 0
            },

            market_sell_survey:{
                total: 0,
                today: 0,
                yesterday: 0,
                week: 0,
                month: 0
            },

            transactions: {

                count: 0,

                successful:{
                    count: 0,
                    amount: 0,
                    today: 0,
                    week: 0,
                    month: 0
                },

                failed: {
                    count: 0,
                    amount: 0,
                    today: 0,
                    week: 0,
                    month: 0
                }
            }

        };

        return Promise.all([

            //  process market requests
            Models.market_request.findAll({
                attributes: [ "id", "date_delivered", "date_created" ]
            }).then(requests => {

                stats.market_requests.total = requests.length;
                stats.market_requests.delivered = utils.countBy(requests,x => x.date_delivered !== null);
                stats.market_requests.today = utils.countBy(requests, x => utils.isToday(x.date_created) );
                stats.market_requests.yesterday = utils.countBy(requests, x => utils.isYesterday(x.date_created) );
                stats.market_requests.week = utils.countBy(requests, x => utils.isThisWeek(x.date_created) );
                stats.market_requests.month = utils.countBy(requests, x => utils.isThisMonth(x.date_created) );
            }),

            //  process market customers
            Models.market_customers.findAll({
                attributes: [ "id","date_created" ]
            }).then(customers => {

                stats.customers.total = customers.length;
                stats.customers.today = utils.countBy(customers, x => utils.isToday(x.date_created) );
                stats.customers.yesterday = utils.countBy(customers, x => utils.isYesterday(x.date_created) );
                stats.customers.week = utils.countBy(customers, x => utils.isThisWeek(x.date_created) );
                stats.customers.month = utils.countBy(customers, x => utils.isThisMonth(x.date_created) );

            }),

            //  process depot
            Models.depot.findAll({
                attributes: [ "id","date_created" ]
            }).then(depots => {

                stats.depot.total = depots.length;
                stats.depot.today = utils.countBy(depots, x => utils.isToday(x.date_created) );
                stats.depot.yesterday = utils.countBy(depots, x => utils.isYesterday(x.date_created) );
                stats.depot.week = utils.countBy(depots, x => utils.isThisWeek(x.date_created) );
                stats.depot.month = utils.countBy(depots, x => utils.isThisMonth(x.date_created) );

            }),

            //  process market sell survey
            Models.market_sell_survey.findAll({
                attributes: [ "id","date_created" ]
            }).then(surveys => {

                stats.market_sell_survey.total = surveys.length;
                stats.market_sell_survey.today = utils.countBy(surveys, x => utils.isToday(x.date_created) );
                stats.market_sell_survey.yesterday = utils.countBy(surveys, x => utils.isYesterday(x.date_created) );
                stats.market_sell_survey.week = utils.countBy(surveys, x => utils.isThisWeek(x.date_created) );
                stats.market_sell_survey.month = utils.countBy(surveys, x => utils.isThisMonth(x.date_created) );

            }),

            //  process transactions
            Models.transactions.findAll({}).then(transactions => {

                //
                stats.transactions.count = transactions.length;

                //
                const successful = transactions.filter(x => x.status == Constants.TransactionStatus.Succeeded);
                stats.transactions.successful.count = successful.length;
                stats.transactions.successful.amount = utils.sumBy(successful, x => x.actual_amount );
                stats.transactions.successful.today = utils.sumBy( successful.filter(x => utils.isToday(x.date_created)) , x => x.actual_amount );
                stats.transactions.successful.week = utils.sumBy( successful.filter(x => utils.isThisWeek(x.date_created)) , x => x.actual_amount );
                stats.transactions.successful.month = utils.sumBy( successful.filter(x => utils.isThisMonth(x.date_created)) , x => x.actual_amount );

                const failed = transactions.filter(x => x.status != Constants.TransactionStatus.Succeeded);
                stats.transactions.failed.count = failed.length;
                stats.transactions.failed.amount = utils.sumBy(failed, x => x.actual_amount );
                stats.transactions.failed.today = utils.sumBy( failed.filter(x => utils.isToday(x.date_created)) , x => x.actual_amount );
                stats.transactions.failed.week = utils.sumBy( failed.filter(x => utils.isThisWeek(x.date_created)) , x => x.actual_amount );
                stats.transactions.failed.month = utils.sumBy( failed.filter(x => utils.isThisMonth(x.date_created)) , x => x.actual_amount );
            })

        ]).then(() =>{
            return this.data(res,stats);
        });
    }

    getMyself(req,res){
        return this._getOne(req,res,req.user.id);
    }
    getEveryone(req,res){

        this.model.findAll({
        }).then(user => {
            res.json(user);

        }).catch(err=>console.log(err));


    }

    loginAdmin(req,res){

        const body = req.body;
        return this.model.findOne({

            where:{
                email: body.email
            }

        }).then(user => {

            if(!user || !(Password.comparePassword(body.password, user.password_hash , user.password_salt))){
                return this.fail(res,HttpStatus.BAD_REQUEST, "Invalid credentials. Please try again!");
            }

            return this.onSerialize(req,user).then(md => {
                console.log(md);

                const ticket = {
                    access_token: Authentication.generateJwt(user),
                    user: md
                };

                return this.data(res,ticket, "Success" );
            });

        });

    }

    registerAdmin(req,res){

        const body = req.body;

        const user = _.pick(body, [
            'username',
            'first_name',
            'last_name',
            'email',
            'company_id',
            'account_type',
            'phone',
            'registered_by',
            'enable_notification'
        ]);

        let validation = new ValidationError();

        return Promise.all([

           this.checkExists({
               where:{
                   username: user.username
               }
           }).then(exists => {

               if(exists)
                   validation.addField('username','Username already taken','body');

           }),

            this.checkExists({
                where:{
                    email: user.email
                }
            }).then(exists => {

                if(exists)
                    validation.addField('email','Email already exists','body');
            }),

            this.checkExists({
                where:{
                    phone: user.phone
                }
            }).then(exists => {

                if(exists)
                    validation.addField('phone','Phone number already exists','body');
            })

        ]).then(() => {

            if(validation.properties.length > 0){
                throw validation;
            }

            //  #
            user.password_salt = Password.generateSalt();
            user.password_hash = Password.encryptPassword(body.password, user.password_salt);

            return this.model.create(user).then(model => {

                return this.onSerialize(req,model).then(result => {
                    return this.created(res,result, "User registered successfully!");
                });

            });

        });
    }

    changePassword(req,res){

        const body = req.body;
        const user = req.user;
        if(Password.comparePassword(body.originalPassword, user.password_hash, user.password_salt )){

            user.password_salt = Password.generateSalt();
            user.password_hash = Password.encryptPassword(body.newPassword, user.password_salt );

            return user.save().then(() =>{
                return this.noContent(res);
            });
        }

        return this.fail(res,HttpStatus.BAD_REQUEST,"Invalid original password. Please try again");
    }

    updateAdmin(req,res){

        const user = req.user;

        _.merge(user, _.pick(req.body,[
            'email',
            'phone',
            'first_name',
            'last_name',
        ]));

        let validation = new ValidationError();

        return Promise.all([

            this.checkExists({

                where:{
                    id: { [Sequelize.Op.ne] : user.id },
                    email: user.email
                }

            }).then(exists => {

                if(exists)
                    validation.addField('email','Email already exists','body');
            }),

            this.checkExists({
                where:{
                    id: { [Sequelize.Op.ne] : user.id },
                    phone: user.phone
                }
            }).then(exists => {

                if(exists)
                    validation.addField('phone','Phone number already exists','body');
            })

        ]).then(() => {

            if(validation.properties.length > 0){
                throw validation;
            }

            return user.save().then(() => {
                return this.noContent(res);
            });

        });

    }

}

module.exports = AdminController;
