const { logg, Mikrotik, MikrotikConfig } = require('./main');
const { RouterOSAPI } = require('node-routeros');
const { notifmikrotik } = require('./whatsapp');
// const { startsocket } = require('./socket');

let mikrotikerror = 0;
let cekstatusinterval;

const host = process.env.HOST;
const user = process.env.USER;
const password = process.env.PASSWD;
const port = process.env.PORTMIKROTIK;
const interval = parseInt(process.env.INTERVAL || 10);

const client = new RouterOSAPI({
    host: MikrotikConfig.host,
    user: MikrotikConfig.user,
    password: MikrotikConfig.pass,
    port: MikrotikConfig.port,
    timeout: MikrotikConfig.timeout,
});

async function connect(){
    let response;
    try {
        response = await client.connect();
        cekstatusinterval = setInterval(CekStatus, interval * 60 * 1000)
        Mikrotik.mikrotikstatus = true;
        Mikrotik.mikrotikidentity = (await client.write('/system/identity/print'))[0].name;
        // console.log(Mikrotik.mikrotikidentity);
        logg(true, `Mikrotik berhasil terhubung`);
        return { success: true, message: `Mikrotik berhasil terhubung`}
    } catch (err){
        Mikrotik.mikrotikstatus = false;
        logg(false, `Mikrotik gagal terhubung`)
        return { success: false, message: `Mikrotik gagal terhubung` }
    }
}

async function CekStatus() {
    let response;
    try {
        response = await status()
        logg(response.success, response.message);
        if (!response.success) {
            mikrotikerror++;
            await notifmikrotik(`Mikrotik ${Mikrotik.mikrotikidentity} terputus/gagal terhubung`);
            response = await client.connect();
            if (!response.connected) {
                if (mikrotikerror >= 3) {
                    Mikrotik.mikrotikstatus = false;
                    clearInterval(cekstatusinterval);
                }
            } else {
                mikrotikerror = 0;
            }
        } else {
            mikrotikerror = 0;
        }
    } catch (err) {
        logg(false, `Terjadi kesalahan saat memeriksa status: ${err}`);
    }
}

async function status(){
    try {
        await client.write("/ip/cloud/force-update");
        Mikrotik.mikrotikidentity = (await client.write('/system/identity/print'))[0].name;
        return { success: true, message: "Koneksi dengan Mikrotik masih terhubung" };
    } catch (err){
        return { success: false, message: "Koneksi dengan Mikrotik terputus", response: err };
    }
}

module.exports = {
    connect,
    client,
}