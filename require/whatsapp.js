const { logg, moment, Mikrotik, APP_DEBUG, APP_ENV, whatsapp } = require('./main');
const axios = require('axios');

const WAHA = {
    ...whatsapp
}

// console.log(APP_DEBUG, APP_ENV);

// async function KirimPesanWA(nomorTujuan, pesan, linkGambar) {
//     if (!APP_DEBUG && APP_ENV !== 'local') {
//         const payload = linkGambar
//             ? { apikey: apikeyWA, to: nomorTujuan, message: pesan, url: linkGambar }
//             : { apikey: apikeyWA, to: nomorTujuan, message: pesan };
    
//         const options = {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             data: JSON.stringify(payload),
//             url: urlWA,
//         };
    
//         try {
//             const response = await axios(options);
//             // console.log(response.data);
//             return response.data;
//         } catch (err) {
//             return KirimPesanWA2(nomorTujuan, pesan);
//         }
//     } else {
//         return { success: false, message: `Aplikasi dalam mode pengembang`};
//     }
// }

async function KirimPesanWA(nomorTujuan, pesan, linkGambar) {
    const payload = linkGambar
        ? {
            chatId: nomorTujuan,
            file: {
              mimetype: "image/jpeg",
              filename: "clarice.jpg",
              url: linkGambar
            },
            reply_to: null,
            caption: pesan,
            session: WAHA.session
          }
        : {
            chatId: nomorTujuan,
            reply_to: null,
            text: pesan,
            linkPreview: true,
            session: WAHA.session
          };
    const url = linkGambar ? `${WAHA.url}/api/sendImage` : `${WAHA.url}/api/sendText`;

    const options = {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "X-Api-key": WAHA.key // Menambahkan header X-Api-key
        },
        data: JSON.stringify(payload),
        url: url,
    };

    try {
        const response = await axios(options);
        // console.log(response.data);
        // return response.data;
        return { success: true, response};
    } catch (err) {
        return KirimPesanWA2(nomorTujuan, pesan, linkGambar);
    }
}

async function KirimPesanWA2(nomorTujuan, pesan, linkGambar) {
    const payload = linkGambar
        ? {
            chatId: nomorTujuan,
            file: {
              mimetype: "image/jpeg",
              filename: "clarice.jpg",
              url: linkGambar
            },
            reply_to: null,
            caption: pesan,
            session: WAHA.session
          }
        : {
            chatId: nomorTujuan,
            reply_to: null,
            text: pesan,
            linkPreview: true,
            session: WAHA.session
          };
    const url = linkGambar ? `${WAHA.url}/api/sendImage` : `${WAHA.url}/api/sendText`;

    const options = {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "X-Api-key": WAHA.key // Menambahkan header X-Api-key
        },
        data: JSON.stringify(payload),
        url: url,
    };

    try {
        const response = await axios(options);
        // // console.log(response.data);
        // return response.data;
        return { success: true, response};
    } catch (err) {
        console.log(err.message || err)
        return { success: false, response: err };
    }
}

async function kirimNotif(pesan) {
    if (!APP_DEBUG && APP_ENV !== 'local') {
        const payload = {
            chatId: WAHA.grupNotif,
            reply_to: null,
            text: pesan,
            linkPreview: true,
            session: WAHA.session
        };

        const url = `${WAHA.url}/api/sendText`;
    
        const options = {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "X-Api-key": WAHA.key // Menambahkan header X-Api-key
            },
            data: JSON.stringify(payload),
            url: url,
        };
    
        try {
            const response = await axios(options);
            // console.log(response.data);
            // return response.data;
            return { success: true, response};
        } catch (err) {
            console.log(err.message || err);
            return { success: false, response: err.message || err };
        }
    } else {
        return { success: false, message: `Aplikasi dalam mode pengembang`};
    }
}

async function notif(hostname, username, role, message) {
    if (!APP_DEBUG && APP_ENV !== 'local') {
        let pesan = `Waktu : ${moment().format("DD/MMMM/YYYY - hh:mm:ss")}\nHostname : ${hostname}\nMikrotik : ${Mikrotik.mikrotikidentity}\nUsername : ${username}\nRole : ${role}\nMessage : \n\n'${message}'`
        try {
            const response = await kirimNotif(pesan);
            if (response.success) {
                logg(true, `Berhasil mengirimkan notif ke admin`);
            } else {
                logg(false, `Gagal mengirimkan notif ke admin`);
            }
            return response
        } catch (err) {
            console.log(err.message || err)
            return { success: false, response: err.message}
        }
    } else {
        return { success: false, message: `Aplikasi dalam mode pengembang`};
    }
}

async function notifspam(message) {
    try {
        const payload = {
            chatId: WAHA.grupSpam,
            reply_to: null,
            text: message,
            linkPreview: true,
            session: WAHA.session
        }

        const url = `${WAHA.url}/api/sendText`;
    
        const options = {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "X-Api-key": WAHA.key // Menambahkan header X-Api-key
            },
            data: JSON.stringify(payload),
            url: url,
        };
    
        try {
            const response = await axios(options);
            // console.log(response.data);
            // return response.data;
            return { success: true, response};
        } catch (err) {
            logg(false, (err.message || err));
            return { success: false, response: err.message || err };
        }
    } catch (e) {
        return { success: false, response: err.response.data || err.message || err };
    }
}

async function notifmikrotik(message) {
    if (!APP_DEBUG && APP_ENV !== 'local') {
        let pesan = `Waktu : ${moment().format("DD/MMMM/YYYY - hh:mm:ss")}\n\n\n*'${message}'*\nMohon segera dicek lebih lanjut!`
        try {
            const response = await kirimNotif(pesan);
            if (response.success) {
                logg(true, `Berhasil mengirimkan notif ke admin`);
            } else {
                logg(false, `Gagal mengirimkan notif ke admin`);
            }
            return response
        } catch (err) {
            return { success: false, response: err.message}
        }
    } else {
        return { success: false, message: `Aplikasi dalam mode pengembang`};
    }
}

module.exports = {
    KirimPesanWA,
    kirimNotif,
    notif,
    notifmikrotik,
    notifspam,
};