const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const transport = nodemailer.createTransport({
   service: process.env.MAIL_SERVICE,
   host: process.env.MAIL_HOST,
   port: process.env.MAIL_PORT,
   secure: true,
   auth: {
       user: process.env.MAIL_USER_EMAIL,
       pass: process.env.MAIL_USER_PASSWORD
   }
});

/**
 * Template cache
 */
const TemplateCache = {};

const processTemplate = (name,placeholders) => {

    let _template = "";
    const _absolutePath = path.join(__dirname,`/email_templates/${name}.html`);
    if(TemplateCache[_absolutePath]){
        _template = TemplateCache[_absolutePath];
    }else{
        _template = fs.readFileSync(_absolutePath,{ encoding: 'utf-8' });
        TemplateCache[_absolutePath] = _template;
    }

    //
    if(_template){

        Object.keys(placeholders).forEach(k => {
            _template = _template.replace(new RegExp(`{{${k}}}`,'g'),placeholders[k]);
        });

    }


    return _template;
};

exports.sendEmailTemplate = function (name, destination , subject, placeholders) {

    const _template = processTemplate(name,placeholders);
    if(_template){
        return exports.sendHtml(_template,destination,subject);
    }
};

exports.sendHtml = async function (html,destination,subject) {

    if(!Array.isArray(destination)){
        destination = [destination];
    }

    return destination.map(d => {

        return transport.sendMail({
            from:  process.env.MAIL_USER_EMAIL, // sender address
            to: d, // list of receivers
            subject: subject, // Subject line
            html: html, // plain text body
        });

    });

};

exports.sendText = async function (text, destination,subject) {

    if(!Array.isArray(destination)){
        destination = [destination];
    }

    return destination.map(d => {

        return transport.sendMail({
            from:  process.env.MAIL_USER_EMAIL, // sender address
            to: d, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
        });

    });

};