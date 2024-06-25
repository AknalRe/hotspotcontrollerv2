const { logg, Mikrotik, moment } = require('./main');
const { KirimPesanWA, kirimNotif, notif } = require('./whatsapp');
const { client } = require('./mikrotik');

async function testINT(input) {
    const isNumber = !isNaN(input);
    if (isNumber && input.length >= 10) {
        return true;
    } else {
        return false;
    }
}

async function CekTotalUserHotspot() {
    const mikrotik = Mikrotik.mikrotikstatus;
    let success = false;
    // logg(true, 'Memeriksa total pengguna hotspot...');
    if (mikrotik) {
        try {
            let response = await client.write('/ip/hotspot/user/print')
            let newData = {
                name: 'demo',
                password: 'demo',
                profile: 'Demo',
                disabled: 'false'
            };
            response.push(newData);
            newData = {
                name: 'admin',
                password: 'csoperator',
                profile: 'Admin',
                disabled: 'false'
            };
            response.push(newData);
            newData = {
                name: 'admin2',
                password: 'csoperator2',
                profile: 'Admin',
                disabled: 'false'
            };
            response.push(newData);
            if (response) {
                success = true;
                // logg(true, 'Berhasil mendapatkan data pengguna hotspot.');
                return { success: success, data: response, message: "Berhasil mendapatkan data" }
            } else {
                // logg(false, 'Gagal mendapatkan data pengguna hotspot.');
                return { success: success, data: "", message: "Gagal mendapatkan data" }
            }
        } catch (e) {
            // logg(false, `Error: ${e.message}`);
            return { success: success, data: "", message: e.message }
        }
    } else {
        // logg(false, 'Mikrotik tidak terhubung.');
        return { success: success, data: "", message: "Mikrotik Tidak Terhubung" }
    }
}

async function checkakun(username) {
    const { mikrotikstatus } = Mikrotik;
    if (mikrotikstatus) {
        try {
            let akunhotspot = await client.write('/ip/hotspot/user/print', [
                '=detail=',
                '?name=' + username,
            ]);
            akunhotspot = akunhotspot[0];
            if (akunhotspot && akunhotspot.name === username) {
                logg(true, `Akun (${username}) sudah ada`);
                return { success: true, message: akunhotspot };
            } else {
                logg(false, `Akun (${username}) tidak ada`);
                return { success: false, message: "Akun tidak ditemukan" };
            }
        } catch (err) {
            logg(false, `Error: ${err}`);
            return { success: false, message: err };
        }
    } else {
        logg(false, `Mikrotik Tidak Terhubung`);
        return { success: false, message: "Mikrotik Tidak Terhubung" };
    }
}

async function getUcapan() {
    const currentTime = new Date().getHours();
    if(currentTime >= 5 && currentTime < 11) {
        return "Selamat Pagi"
    } else if (currentTime >= 11 && currentTime < 15) {
        return "Selamat Siang"
    } else if (currentTime >= 15 && currentTime < 17) {
        return "Selamat Sore"
    } else {
        return "Selamat Malam"
    }
}

async function addakun(username, jenisakun, password, comment) {
    const { mikrotikstatus } = Mikrotik;
    if (mikrotikstatus) {
        try {
            const commands = [
                `=name=${username}`,
                `=password=${password ? password : username}`,
                `=profile=${jenisakun}`,
                '=disabled=false',
                `=comment=${comment ? comment : ""}`,
            ];

            // Cek apakah akun hotspot sudah tersedia
            let isAkunHotspotAvailable = await checkakun(username);

            // Cek apakah username merupakan nomor
            const isnumber = await testINT(username);

            // Jika akun hotspot sudah tersedia, kembalikan respons dengan pesan bahwa username sudah ada
            if (isAkunHotspotAvailable.success) {
                logg(false, `Username (${username}) hotspot sudah ada!`)
                return { success: false, title: `Tambah Akun Hotspot`, message: `Username (${username}) hotspot sudah ada!` };
            }

            await client.write('/ip/hotspot/user/add', commands);
            
            const resultcreateuser = await checkakun(username);
            if (resultcreateuser.success) {
                let response = { success: false }, nomortujuan, ucapan, pesan;
                if (isnumber) {
                    nomortujuan = username;
                    ucapan = await getUcapan();
                    const wifi = jenisakun.toLowerCase().includes("clarice") ? "WiFi Clarice" : jenisakun.toLowerCase().includes("haicantik") ? "WiFi Haicantik" : "WiFi"
                    pesan = `${ucapan}\n\nBerikut kami informasi akun untuk login pada ${wifi} :\n\nUsername : ${username}${password ? `\nPassword : ${password}` : ''}\n\nHarap untuk login sesuai dengan data diatas.\nTerima Kasih`;
                    response = await KirimPesanWA(nomortujuan, pesan);
                }
                logg(resultcreateuser.success, response.success ? `Username (${username}) berhasil di buat dan berhasil kirim notif` : `Username (${username}) berhasil di buat`);
                return { success: true, title: `Tambah Akun Hotspot`, successwa: response.success, message: `Username (${username}) berhasil di buat`};
            } else {
                logg(resultcreateuser.success, `Username (${username}) gagal di buat`);
                return { success: false, title: `Tambah Akun Hotspot`, message: `Username (${username}) gagal di buat`};
            }
        } catch (err) {
            logg(false, `Terjadi kesalahan tambah akun hotspot : ${err.message}`);
            return { success: false, title: `Tambah Akun Hotspot`, message: `Terjadi kesalahan tambah akun hotspot : ${err.message}`}
        }
    } else {
        logg(false, `Mikrotik Tidak Terhubung`);
        return { success: false, title: `Tambah Akun Hotspot`, message: "Mikrotik Tidak Terhubung"}
    }
}

async function listakun(role) {
    const mikrotik = Mikrotik.mikrotikstatus;
    if(mikrotik) {
        try {
            const response = await client.write('/ip/hotspot/user/print');
            const filteredData = response.filter(item => {
                if (role == "Administrator") {
                    return item[".id"] !== "*0" && item[".id"] !== "*2";
                } else if (role == "Demo") {
                    let panjang = item.password ? (item.password.length >= 12 ? item.password.length : 16) : 16;
                    let passwordDiganti = '*'.repeat(panjang);
                    let nama = item.name.substring(0, 3) + "*".repeat(item.name.length >= 16 ? (item.name.length - 3) : (20 - 3));
                    let profil = "*".repeat(12);
                    item.password = passwordDiganti;
                    item.name = nama;
                    item.profile = profil;
                    return item[".id"] !== "*0" && item[".id"] !== "*2";
                } else {
                    return item.profile && item.profile.includes("Tamu") && item[".id"] !== "*0" && item[".id"] !== "*2";
                }
            });
            return { success: true, data: filteredData };
        } catch (err) {
            return { success: false, data: "", error: err };
        }
    } else {
        return { success: false, data: "", error: "Mikrotik tidak terhubung" }
    }
}

async function listakunuser(name) {
    const mikrotik = Mikrotik.mikrotikstatus;
    if(mikrotik) {
        try {
            const response = await client.write('/ip/hotspot/user/print' , [
                '?name=' + name
            ]);
            return { success: true, data: response };
        } catch (err) {
            return { success: false, data: "", error: err };
        }
    } else {
        return { success: false, data: "", error: "Mikrotik tidak terhubung" }
    }
}

async function editakun(usernamelama, id, username, jenisakun, password, comment) {
    // console.log(usernamelama, id, username, jenisakun, password)
    const { mikrotikstatus } = Mikrotik;
    if (mikrotikstatus) {
        try {
            let isAkunHotspotAvailable = await checkakun(username);
            // if (isAkunHotspotAvailable.success) {
            //     logg(false, `Username (${username}) hotspot sudah ada, silakan gunakan username lain!`)
            //     return { success: false, title: `Edit Akun Hotspot`, message: `Username (${username}) hotspot sudah ada, silakan gunakan username lain!` };
            // }

            let newpassword = password ? password : username;
            const isnumber = await testINT(usernamelama);

            await client.write('/ip/hotspot/user/set', [
                "=.id=" + id,
                "=name=" + username,
                "=password=" + newpassword,
                "=profile=" + jenisakun,
                "=comment=" + comment,
            ])

            isAkunHotspotAvailable = await checkakun(username);
            if (isAkunHotspotAvailable.success) {
                logg(true, `Data (${usernamelama}) berhasil di ubah ke data baru`);
                let response = { success: false }, nomortujuan, ucapan, pesan;
                if (isnumber) {
                    nomortujuan = usernamelama;
                    ucapan = await getUcapan();
                    const wifi = jenisakun.toLowerCase().includes("clarice") ? "WiFi Clarice" : jenisakun.toLowerCase().includes("haicantik") ? "WiFi Haicantik" : "WiFi"
                    pesan = `${ucapan}\n\nBerikut kami informasi data perubahan akun untuk login pada ${wifi} :\n\nUsername : ${username}${password ? `\nPassword : ${password}` : ''}\n\nHarap untuk login sesuai dengan data diatas.\nTerima Kasih`;
                    response = await KirimPesanWA(nomortujuan, pesan);
                }
                return response.success ? { success: true, successwa: false, title: `Edit Akun Hotspot`, message: `Data akun (${usernamelama}) berhasil di ubah ke data baru`} : { success: true, successwa: true, message: `Data akun (${usernamelama}) berhasil di ubah ke data baru`};
            } else {
                logg(false, `Data akun (${usernamelama}) gagal di ubah`);
                return { success: false, title: `Edit Akun Hotspot`, message: `Data akun (${usernamelama}) gagal di ubah`}
            }
        } catch (err) {
            logg(false, `Terjadi kesalahan edit akun hotspot : ${err.message}`);
            return { success: false, title: `Edit Akun Hotspot`, message: `Terjadi kesalahan edit akun hotspot : ${err.message}`}
        }
    } else {
        logg(false, `Mikrotik Tidak Terhubung`);
        return { success: false, title: `Edit Akun Hotspot`, message: `Mikrotik Tidak Terhubung`}
    }
}

async function cekbinding(add, mac) {
    const { mikrotikstatus } = Mikrotik;
    try {
        if (mikrotikstatus) {
            const response = await client.write('/ip/hotspot/ip-binding/print', [
                '?address=' + add,
                '?mac-address=' + mac,
            ]);
            if (response.length > 0) {
                logg(true, `Data binding mac (${mac}) ditemukan`);
                return { success: true, id: response[0]['.id'] };
            } else {
                logg(false, `Data binding mac (${mac}) tidak di temukan`);
                return { success: false };
            }
        } else {
            logg(false, `Mikrotik tidak terhubung`);
            return { success: false };
        }
    } catch (err) {
        logg(false, `Terjadi kesalahan cekbinding, error: ${err.message}`);
        return { success: false };
    }
}

async function addbinding(action, id, add, toadd, mac, server, req) {
    const { mikrotikstatus } = Mikrotik;
    try {
        if (mikrotikstatus) {
            const response = await cekbinding(add, mac);
            if (!response.success) {
                await client.write('/ip/hotspot/ip-binding/add', [
                    "=comment=" + `${moment().format("DD/MMMM/YYYY - hh:mm:ss")} - ${req.session.username}/${req.session.role}`,
                    "=address=" + add,
                    "=to-address=" + toadd,
                    '=mac-address=' + mac,
                    '=server=' + server,
                    '=type=bypassed',
                    '=disabled=false',
                ]);
                logg(true, `Berhasil binding akun ${add}-${mac}`);
                await notif(req.hostname, req.session.username, req.session.role, `Berhasil binding akun ${add}-${mac}`);
                return { success: true, title: "Binding Host", message: `Berhasil binding akun ${add}-${mac}` };
            } else {
                if (action) {
                    await client.write('/ip/hotspot/ip-binding/set', [
                        '=.id=' + response.id,
                        "=disabled=true",
                    ])
                    logg(true, `Berhasil nonaktifkan binding akun ${add}-${mac}`);
                    await notif(req.hostname, req.session.username, req.session.role, `Berhasil nonaktifkan binding akun ${add}-${mac}`);
                    return { success: true, title: "Binding Host", message: `Berhasil nonaktifkan binding akun ${add}-${mac}` };
                } else {
                    await client.write('/ip/hotspot/ip-binding/set', [
                        '=.id=' + response.id,
                        "=disabled=false",
                    ])
                    logg(true, `Berhasil mengaktifkan binding akun ${add}-${mac}`);
                    await notif(req.hostname, req.session.username, req.session.role, `Berhasil mengaktifkan binding akun ${add}-${mac}`);
                    return { success: true, title: "Binding Host", message: `Berhasil mengaktifkan binding akun ${add}-${mac}` };
                }
            }
        } else {
            logg(false, `Mikrotik tidak terhubung`)
            return { success: false, title: "Binding Host", message: `Mikrotik tidak terhubung` };
        }
    } catch (err) {
        logg(false, `Terjadi kesalahan saat mencoba binding akun, error: ${err.message}`);
        return { success: false, title: "Binding Host", message: `Error binding akun ${add}-${mac}`, response: err };
    }
}

module.exports = {
    CekTotalUserHotspot,
    addakun,
    listakun,
    editakun,
    addbinding,
    listakunuser,
    testINT
}
