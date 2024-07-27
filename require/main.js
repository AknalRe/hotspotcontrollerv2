require('dotenv').config();

const path = require('path');
const QRCode = require('qrcode');
const fs = require('fs');
const moment = require('moment-timezone');
require('moment/locale/id');
moment.locale('id');

const { APP_ENV, APP_PORT, APP_NAME, APP_TITLE, APP_AUTHOR, MK_HOST, MK_PORT, MK_USER, MK_PASS, MK_TIMEOUT, LINKWA, LINKWA2, APIKEYWA, APIKEYWA2, IDKOMUNITAS, IDGRUPINFOSPAM, PROFILE_DEFAULT_TAMU, PARAM_USERTAMBAH, URL_HOTSPOT, WEBHOOKN8N, PATH_BANNER } = process.env;
const APP_DEBUG = process.env.APP_DEBUG == "true";

const MikrotikConfig = {
    host: MK_HOST,
    port: (MK_PORT || 8729),
    user: MK_USER,
    pass: MK_PASS,
    timeout: (parseInt(MK_TIMEOUT || 3000))
}

const whatsapp = {
    LINKWA: LINKWA,
    LINKWA2: LINKWA2,
    APIKEYWA: APIKEYWA,
    APIKEYWA2: APIKEYWA2,
    IDKOMUNITAS: IDKOMUNITAS,
    IDGRUPINFOSPAM: IDGRUPINFOSPAM,
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
            console.log(`${biru}[${moment().format("DD/MMMM/YYYY - HH:mm:ss")}] - ${putih}${message}`);
        } catch (err) {
            console.log(`${biru}[${moment().format("DD/MMMM/YYYY - HH:mm:ss")}] - ${putih}${merah}${err}${putih}`);
        }
    } else {
        try {
            console.log(`${biru}[${moment().format("DD/MMMM/YYYY - HH:mm:ss")}] - ${putih}${merah}${message}${putih}`);
        } catch (err) {
            console.log(`${biru}[${moment().format("DD/MMMM/YYYY - HH:mm:ss")}] - ${putih}${merah}${err}${putih}`);
        }
    }
}

module.exports = {
    path,
    logg,
    fs,
    QRCode,
    moment,
    Mikrotik,
    MikrotikConfig,
    APP_ENV,
    APP_DEBUG,
    APP_NAME,
    APP_TITLE,
    APP_AUTHOR,
    APP_PORT,
    whatsapp,
    PROFILE_DEFAULT_TAMU,
    PARAM_USERTAMBAH,
    URL_HOTSPOT,
    WEBHOOKN8N,
    PATH_BANNER
}