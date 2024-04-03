require('dotenv').config();

const path = require('path');
const fs = require('fs');
const moment = require('moment-timezone');
require('moment/locale/id');
moment.locale('id');

const { APP_ENV, APP_DEBUG, APP_PORT, APP_NAME, APP_TITLE, APP_AUTHOR, MK_HOST, MK_PORT, MK_USER, MK_PASS, MK_TIMEOUT } = process.env;

const MikrotikConfig = {
    host: MK_HOST,
    port: (MK_PORT || 8729),
    user: MK_USER,
    pass: MK_PASS,
    timeout: (parseInt(MK_TIMEOUT || 3000))
}

const Mikrotik = {
    mikrotikstatus: false,
    mikrotikidentity: "",
}

async function logg(status, message) {
    const merah = "\x1b[31m";
    const putih = "\x1b[0m";
    const biru = "\x1b[34m";
    if (status == true) {
        try {
            console.log(`${biru}[${moment().format("DD/MMMM/YYYY - hh:mm:ss")}] - ${putih}${message}`);
        } catch (err) {
            console.log(`${biru}[${moment().format("DD/MMMM/YYYY - hh:mm:ss")}] - ${putih}${merah}${err}${putih}`);
        }
    } else {
        try {
            console.log(`${biru}[${moment().format("DD/MMMM/YYYY - hh:mm:ss")}] - ${putih}${merah}${message}${putih}`);
        } catch (err) {
            console.log(`${biru}[${moment().format("DD/MMMM/YYYY - hh:mm:ss")}] - ${putih}${merah}${err}${putih}`);
        }
    }
}

module.exports = {
    path,
    logg,
    fs,
    moment,
    Mikrotik,
    MikrotikConfig,
    APP_ENV,
    APP_DEBUG,
    APP_NAME,
    APP_TITLE,
    APP_AUTHOR,
    APP_PORT
}