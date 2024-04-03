const path = require('path');

const { router, isAuthenticated } = require('./server');
const { logg, moment, fs, APP_NAME, APP_TITLE, APP_AUTHOR, Mikrotik } = require('./main');
const { CekTotalUserHotspot, addakun, listakun, editakun, addbinding, listakunuser } = require("./mikrotikfunction");
const { KirimPesanWA, kirimNotif, notif } = require('./whatsapp');
const { client } = require('./mikrotik');
const { ExportXLSX } = require('./export');

// GET
router.get('/', isAuthenticated, async (req, res) => {
    const { mikrotikstatus } = Mikrotik;
    req.session.prevpage = req.path;
    const role = req.session.role;
    const userRole = (role === "Demo" ? "Administrator" : role !== "Administrator" && role !== "Admin" ? "User" : role).toLowerCase();
    const style = (userRole !== "administrator" && userRole !== "admin" ? "user" : "style");
    const data = {
        auth: true,
        mikrotik: mikrotikstatus,
        user_name: req.session.name,
        user_username: req.session.username,
        user_role: (role == "Demo" ? "Administrator" : role),
        title: APP_TITLE,
        author: APP_AUTHOR,
        name_page: `Home - ${APP_TITLE}`,
        scriptglobal: "scripts/script",
        footer: "footer",
        style: style,
        navbar: `navbar/${userRole}`,
        page: `partials/${userRole}/home`,
        scriptlocal: `scripts/${userRole}/home`
    };
    res.render('index', data);
});

router.get('/listakun', isAuthenticated, async (req, res) => {
    const { mikrotikstatus } = Mikrotik;
    req.session.prevpage = req.path;
    const role = req.session.role;
    const userRole = (role === "Demo" ? "Administrator" : role !== "Administrator" && role !== "Admin" ? "User" : role).toLowerCase();
    const style = (userRole !== "administrator" && userRole !== "admin" ? "user" : "style");
    const data = {
        auth: true,
        mikrotik: mikrotikstatus,
        user_name: req.session.name,
        user_username: req.session.username,
        user_role: (role == "Demo" ? "Administrator" : role),
        title: APP_TITLE,
        author: APP_AUTHOR,
        name_page: `List Akun - ${APP_TITLE}`,
        scriptglobal: "scripts/script",
        footer: "footer",
        style: style,
        navbar: `navbar/${userRole}`,
        page: `partials/${userRole}/listakun`,
        scriptlocal: `scripts/${userRole}/listakun`
    };
    res.render('index', data);
})

router.get('/listakunaktif', isAuthenticated, async (req, res) => {
    const { mikrotikstatus } = Mikrotik;
    req.session.prevpage = req.path;
    const role = req.session.role;
    const userRole = (role === "Demo" ? "Administrator" : role !== "Administrator" && role !== "Admin" ? "User" : role).toLowerCase();
    const style = (userRole !== "administrator" && userRole !== "admin" ? "user" : "style");
    const data = {
        auth: true,
        mikrotik: mikrotikstatus,
        user_name: req.session.name,
        user_username: req.session.username,
        user_role: (role == "Demo" ? "Administrator" : role),
        title: APP_TITLE,
        author: APP_AUTHOR,
        name_page: `List Akun Aktif - ${APP_TITLE}`,
        scriptglobal: "scripts/script",
        footer: "footer",
        style: style,
        navbar: `navbar/${userRole}`,
        page: `partials/${userRole}/listakunaktif`,
        scriptlocal: `scripts/${userRole}/listakunaktif`
    };
    res.render('index', data);
})

router.get('/limitasiakun', isAuthenticated, async (req, res) => {
    const { mikrotikstatus } = Mikrotik;
    req.session.prevpage = req.path;
    const role = req.session.role;
    const userRole = (role === "Demo" ? "Administrator" : role !== "Administrator" && role !== "Admin" ? "User" : role).toLowerCase();
    const style = (userRole !== "administrator" && userRole !== "admin" ? "user" : "style");
    const data = {
        auth: true,
        mikrotik: mikrotikstatus,
        user_name: req.session.name,
        user_username: req.session.username,
        user_role: (role == "Demo" ? "Administrator" : role),
        title: APP_TITLE,
        author: APP_AUTHOR,
        name_page: `List Limitasi - ${APP_TITLE}`,
        scriptglobal: "scripts/script",
        footer: "footer",
        style: style,
        navbar: `navbar/${userRole}`,
        page: `partials/${userRole}/limitasiakun`,
        scriptlocal: `scripts/${userRole}/limitasiakun`
    };
    res.render('index', data);
});

router.get('/listbinding', isAuthenticated, async (req, res) => {
    const { mikrotikstatus } = Mikrotik;
    req.session.prevpage = req.path;
    const role = req.session.role;
    const userRole = (role === "Demo" ? "Administrator" : role !== "Administrator" && role !== "Admin" ? "User" : role).toLowerCase();
    const style = (userRole !== "administrator" && userRole !== "admin" ? "user" : "style");
    const data = {
        auth: true,
        mikrotik: mikrotikstatus,
        user_name: req.session.name,
        user_username: req.session.username,
        user_role: (role == "Demo" ? "Administrator" : role),
        title: APP_TITLE,
        author: APP_AUTHOR,
        name_page: `List Klien - ${APP_TITLE}`,
        scriptglobal: "scripts/script",
        footer: "footer",
        style: style,
        navbar: `navbar/${userRole}`,
        page: `partials/${userRole}/listbinding`,
        scriptlocal: `scripts/${userRole}/listbinding`
    };
    res.render('index', data);
});

router.get('/loghotspot', isAuthenticated, async (req, res) => {
    const { mikrotikstatus } = Mikrotik;
    req.session.prevpage = req.path;
    const role = req.session.role;
    const userRole = (role === "Demo" ? "Administrator" : role !== "Administrator" && role !== "Admin" ? "User" : role).toLowerCase();
    const style = (userRole !== "administrator" && userRole !== "admin" ? "user" : "style");
    const data = {
        auth: true,
        mikrotik: mikrotikstatus,
        user_name: req.session.name,
        user_username: req.session.username,
        user_role: (role == "Demo" ? "Administrator" : role),
        title: APP_TITLE,
        author: APP_AUTHOR,
        name_page: `Log Hotspot - ${APP_TITLE}`,
        scriptglobal: "scripts/script",
        footer: "footer",
        style: style,
        navbar: `navbar/${userRole}`,
        page: `partials/${userRole}/loghotspot`,
        scriptlocal: `scripts/${userRole}/loghotspot`
    };
    res.render('index', data);
});

router.get('/bannerhotspot', isAuthenticated, async (req, res) => {
    const { mikrotikstatus } = Mikrotik;
    req.session.prevpage = req.path;
    const role = req.session.role;
    const userRole = (role === "Demo" ? "Administrator" : role !== "Administrator" && role !== "Admin" ? "User" : role).toLowerCase();
    const style = (userRole !== "administrator" && userRole !== "admin" ? "user" : "style");
    const data = {
        auth: true,
        mikrotik: mikrotikstatus,
        user_name: req.session.name,
        user_username: req.session.username,
        user_role: (role == "Demo" ? "Administrator" : role),
        title: APP_TITLE,
        author: APP_AUTHOR,
        name_page: `Banner Hotspot - ${APP_TITLE}`,
        scriptglobal: "scripts/script",
        footer: "footer",
        style: style,
        navbar: `navbar/${userRole}`,
        page: `partials/${userRole}/bannerhotspot`,
        scriptlocal: `scripts/${userRole}/bannerhotspot`
    };
    res.render('index', data);
});

// router.get('/user', async (req, res) => {
//     req.session.prevpage = req.path;
//     const response = await CekTotalUserHotspot();
//     // console.log(JSON.parse(JSON.stringify(response.data)));
//     console.log(response.data);
//     res.render('testing', { response: response})
// })

// POST
router.post('/testing', async (req, res) => {
    let success = false;
    const { status } = req.body;
    if (status) {
        success = true;
    }
    res.json({ success: success, title: `Testing Toast`, message: `Hello Worldaaaaaaaaaaaaaa` });
})

router.post('/login', async (req, res) => {
    const ip = req.headers['x-forwarded-for']
        ? `${req.headers['x-forwarded-for']}`
        : `${req.ip == "::1" ? "127.0.0.1" : req.ip.replace("::ffff:", "")}`;
    try {
        const { username, password } = req.body;

        const userData = await CekTotalUserHotspot();

        const user = userData.data.find(user =>
            user.disabled !== "true" && user.name === username && user.password === password
        );

        if (user) {
            req.session = req.session || {};

            req.session.username = username;
            req.session.role = user.profile;
            req.session.name = user.name.replace(/\d+/g, '');
            console.log(await notif(req.hostname, req.session.username, req.session.role, `${ip} - Berhasil login username : ${username}`));
            res.json({ success: true, title: `Autentikasi`, message: 'Login berhasil!' });
        } else {
            res.json({ success: false, title: `Autentikasi`, message: 'Login gagal. Periksa username dan password!' });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, title: `Autentikasi`, message: 'Terjadi kesalahan pada server.' });
    }
});

router.post('/infoprofilhotspot', isAuthenticated, async (req, res) => {
    const { mikrotikstatus } = Mikrotik;
    const { username, role, name } = req.session;
    try {
        if (mikrotikstatus) {
            const response = await client.write('/ip/hotspot/user/profile/print');
            const filteredData = response.filter(item => {
                if (role === "Administrator") {
                    return item.name !== "default";
                } else if (role == "Demo") {
                    return item.name !== "default"
                } else {
                    return item.name.toLowerCase().includes('tamu');
                }
            });
            res.json({ success: true, response: filteredData });
        } else {
            res.json({ success: false, response: `Mikrotik tidak terhubung` })
        }
    } catch (err) {
        res.json({ success: false, response: err })
    }
});

router.post('/tambahakunhotspot', isAuthenticated, async (req, res) => {
    if (req.session.role.toLowerCase() !== 'demo') {
        const { username, password, jenisAkun } = req.body;
        const response = password ? await addakun(username, jenisAkun, password) : await addakun(username, jenisAkun);
        if (response.success) {
            const notifres = await notif(req.hostname, req.session.username, req.session.role, `Menambahkan akun ${username}-${jenisAkun}`)
            logg(notif.success, notifres.success ? `Berhasil mengirimkan notif informasi tambahakun` : `Gagal mengirimkan notif informasi tambahakun`)
        }
        res.json(response);
    } else {
        res.json({ success: false, message: `Anda berada di user demo` })
    }
});

router.post('/listakun', isAuthenticated, async (req, res) => {
    const { role } = req.session;
    if (!role) {
        return res.json({ success: false, title: `List Akun`, message: 'Silakan login ulang terlebih dahulu' })
    }
    const response = await listakun(role);
    // console.log(response);
    if (response.success) {
        res.json({ success: true, title: `List Akun`, message: `Berhasil mendapatkan data list akun`, data: response.data })
    } else {
        res.json({ success: false, title: `List Akun`, message: `Gagal mendapatkan data list akun`, data: '' })
    }
})

function formatkuota(kuota) {
    let format;
    if (kuota.length > 9) {
        format = (kuota / (1024 * 1024 * 1024)).toFixed(2) + " GB";

    } else {
        format = (kuota / (1024 * 1024)).toFixed(2) + " MB";
    }
    return format;
}

router.post('/exportakun', isAuthenticated, async (req, res) => {
    const { username, role, name } = req.session;
    if (!role) {
        return res.json({ success: false, title: `List Akun`, message: 'Silakan login ulang terlebih dahulu' });
    }
    const response = await listakun(role);
    if (response.success) {
        const transformedData = response.data.map((item, index) => ({
            Nomor: index + 1, // Nomor dimulai dari 1
            Nama: item.name,
            Password: item.password,
            Pemakaian: formatkuota(item['bytes-out']) + ' / ' + formatkuota(item['bytes-in']),
            Profile: item.profile,
            Status: item.disabled === 'false' ? 'Aktif' : 'Nonaktif'
        }));

        let title = `${moment().format("DD-MMMM-YYYY_hh-mm-ss")}_${name}_${role}`;
        const exports = await ExportXLSX(title, transformedData);
        res.json(exports);
    } else {
        res.json({ success: false, title: `Export Akun`, message: `Gagal melakukan export akun`});
    }
})

router.post('/hapusexport', isAuthenticated, async (req, res) => {
    const { username, role, name } = req.session;
    const { file } = req.body;
    if (file) {
        const filePath = path.join(__dirname, '..', 'views', 'public', 'exports', `${file}`);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            logg(true, `Berhasil menghapus file ${file}`);
            res.json({ success: true, title: `Hapus Export Akun`, message: `Berhasil menghapus file ${file}` });
        } else {
            logg(true, `Gagal menghapus file ${file} tidak ditemukan`);
            res.json({ success: false, title: `Hapus Export Akun`, message: `Gagal menghapus file ${file} tidak ditemukan` });
        }
    } else {
        res.json({ success: false, title: `Hapus Export Akun`, message: `Gagal melakukan hapus file export akun`});
    }
})

router.post('/listakunuser', isAuthenticated, async (req, res) => {
    const { role, username } = req.session;
    if (!role) {
        return res.json({ success: false, title: `List Akun`, message: 'Silakan login ulang terlebih dahulu' })
    }
    const response = await listakunuser(username);
    // console.log(response);
    if (response.success) {
        res.json({ success: true, title: `List Akun`, message: `Berhasil mendapatkan data akun`, data: response.data })
    } else {
        res.json({ success: false, title: `List Akun`, message: `Gagal mendapatkan data akun`, data: '' })
    }
})

router.post('/nonaktifkanakunhotspot', isAuthenticated, async (req, res) => {
    if (req.session.role.toLowerCase() !== 'demo') {
        const { mikrotikstatus } = Mikrotik;
        const { id, status, nama } = req.body;
        let message;
        if (status == "true") {
            message = "menonaktifkan";
        } else {
            message = "mengaktifkan";
        }
        if (mikrotikstatus == true) {
            try {
                await client.write("/ip/hotspot/user/set", [
                    "=.id=" + id,
                    "=disabled=" + status,
                ])
                await notif(req.hostname, req.session.username, req.session.role, `Berhasil ${message} akun ${nama}`)
                logg(true, `(${req.session.username}) Berhasil ${message} user (${nama})`);
                res.json({ success: true, message: `Berhasil ${message} user (${nama})` });
            } catch (err) {
                logg(false, `(${req.session.username}) Gagal ${message} user (${nama})`);
                res.json({ success: false, message: `Gagal ${message} user (${nama})` })
            }
        } else {
            res.json({ success: false, message: "Mikrotik Tidak Terkoneksi" });
        }
    } else {
        res.json({ success: false, message: `Anda berada di user demo` })
    }
})

router.post('/deleteakunhotspot', isAuthenticated, async (req, res) => {
    if (req.session.role.toLowerCase() !== 'demo') {
        const { mikrotikstatus } = Mikrotik;
        const { id, nama } = req.body;
        if (mikrotikstatus == true) {
            try {
                await client.write("/ip/hotspot/user/remove", [
                    "=.id=" + id,
                ]);
                await notif(req.hostname, req.session.username, req.session.role, `Berhasil menghapus user ${nama}`);
                logg(true, `(${req.session.username}) Berhasil menghapus user (${nama})`);
                res.json({ success: true, message: `Berhasil menghapus user (${nama})` });
            } catch (err) {
                logg(false, `(${req.session.username}) Gagal menghapus user (${nama})`);
                res.json({ success: false, message: `Gagal menghapus user (${nama})`, response: err });
            };
        } else {
            res.json({ success: false, message: "Mikrotik Tidak Terkoneksi" });
        }
    } else {
        res.json({ success: false, message: `Anda berada di user demo` })
    }
})

router.post('/editakunhotspot', isAuthenticated, async (req, res) => {
    if (req.session.role.toLowerCase() !== 'demo') {
        const { usernamelama, id, username, password, jenisAkun } = req.body;
        // console.log(usernamelama, id, username, password, jenisAkun)
        const ip = req.headers['x-forwarded-for']
            ? `${req.headers['x-forwarded-for']}`
            : `${req.ip == "::1" ? "127.0.0.1" : req.ip.replace("::ffff:", "")}`;
        const response = await editakun(usernamelama, id, username, jenisAkun, password);
        if (response.success) {
            await notif(req.hostname, req.session.username, req.session.role, `Berhasil mengubah data akun ${usernamelama} menjadi ${username}-${jenisAkun}`);
            res.json(response);
        } else {
            res.json(response);
        }
    } else {
        res.json({ success: false, message: `Anda berada di user demo` })
    }
})

router.post('/logoutakunhotspot', isAuthenticated, async (req, res) => {
    if (req.session.role.toLowerCase() !== 'demo') {
        const { mikrotikstatus } = Mikrotik;
        const { id, nama } = req.body;
        try {
            if (mikrotikstatus) {
                let aktifuser;

                aktifuser = await client.write('/ip/hotspot/active/remove', [
                    "=.id=" + id,
                ])
                logg(true, `Berhasil melogout (${nama}) user`);
                await notif(req.hostname, req.session.username, req.session.role, `Berhasil melogout (${nama}) user`);
                res.json({ success: true, title: "User Aktif Logout", message: `Berhasil melogout (${nama}) user` });
            } else {
                logg(false, `Mikrotik tidak terhubung`);
                res.json({ success: false, title: "User Aktif Logout", message: `Mikrotik tidak terhubung` });
            }
        } catch (err) {
            logg(false, `Error melogout (${nama}) user, error: ${err.message}`);
            res.json({ success: false, title: "User Aktif Logout", message: `Error melogout (${nama}) user, error: ${err.message}` });
        }
    } else {
        res.json({ success: false, message: `Anda berada di user demo` })
    }
})

router.post('/logoutkansemua', isAuthenticated, async (req, res) => {
    if (req.session.role.toLowerCase() !== 'demo') {
        const { mikrotikstatus } = Mikrotik;
        try {
            if (mikrotikstatus) {
                let aktifuser;

                aktifuser = await client.write('/ip/hotspot/active/print');

                let count = 0;
                await Promise.all(aktifuser.map(async user => {
                    // console.log(`${count}. ${user['.id']}`);
                    await client.write('/ip/hotspot/active/remove', [
                        '=.id=' + user['.id'],
                    ]);
                    count++;
                }));
                logg(true, `Berhasil melogout (${count}) user`);
                await notif(req.hostname, req.session.username, req.session.role, `Berhasil melogout (${count}) user`);
                res.json({ success: true, title: "User Aktif Logout", message: `Berhasil melogout (${count}) user` });
            } else {
                logg(false, `Mikrotik tidak terhubung`)
                res.json({ success: false, title: "User Aktif Logout", message: `Mikrotik tidak terhubung` });
            }
        } catch (err) {
            logg(false, `Error melogout semua user, error: ${err.message}`)
            res.json({ success: false, title: "User Aktif Logout", message: `Error melogout semua user, error: ${err.message}` });
        }
    } else {
        res.json({ success: false, message: `Anda berada di user demo` })
    }
})

router.post('/limitasiakun', isAuthenticated, async (req, res) => {
    if (req.session.role.toLowerCase() !== 'demo') {
        const { mikrotikstatus } = Mikrotik;
        const { id, nama, priority, maxlimit } = req.body;
        try {
            if (mikrotikstatus) {
                await client.write('/queue/simple/set', [
                    '=.id=' + id,
                    '=priority=' + priority,
                    '=max-limit=' + maxlimit,
                ])

                logg(true, `Berhasil mengedit limitasi (${nama})`);
                await notif(req.hostname, req.session.username, req.session.role, `Berhasil mengedit limitasi (${nama})`);
                res.json({ success: true, title: "User Aktif Logout", message: `Berhasil mengedit limitasi (${nama})` });
            } else {
                logg(false, `Mikrotik tidak terhubung`)
                res.json({ success: false, title: "User Aktif Logout", message: `Mikrotik tidak terhubung` });
            }
        } catch (err) {
            logg(false, `Berhasil mengedit limitasi (${nama}), error: ${err.message}`);
            res.json({ success: false, title: "User Aktif Logout", message: `Berhasil mengedit limitasi (${nama}), error: ${err.message}` });
        }
    } else {
        res.json({ success: false, message: `Anda berada di user demo` })
    }
})

router.post('/listbinding', async (req, res) => {
    const { mikrotikstatus } = Mikrotik;
    const { username, role, name } = req.session;
    try {
        if (mikrotikstatus) {
            const response = await client.write('/ip/hotspot/ip-binding/print');
            const filteredData = response.map(item => {
                if (role !== "Administrator") {
                    let panjang = item["mac-address"].length;
                    let passwordDiganti = '*'.repeat(panjang);
                    item["mac-address"] = passwordDiganti;
                    return item;
                } else {
                    return item;
                }
            });

            res.json({ success: true, title: "List Binding", message: "Berhasil mendapatkan list binding", data: filteredData });
        } else {
            res.json({ success: false, title: "List Binding", message: "Gagal mendapatkan list binding, mikrotik tidak terhubung", data: "" });
        }
    } catch (err) {
        res.json({ success: false, title: "List Binding", message: `Gagal mendapatkan list binding, terjadi kesalahan : ${err.message}`, data: "" });
    }
})

router.post('/binding', isAuthenticated, async (req, res) => {
    if (req.session.role.toLowerCase() !== 'demo') {
        const { mikrotikstatus } = Mikrotik;
        const { username, role, name } = req.session;
        const { action, id, add, toadd, mac, server } = req.body;
        const response = await addbinding(action, id, add, toadd, mac, server, req);
        res.json(response);
    } else {
        res.json({ success: false, message: `Anda berada di user demo` })
    }
})

router.post('/hapusbinding', isAuthenticated, async (req, res) => {
    if (req.session.role.toLowerCase() !== 'demo') {
        const { mikrotikstatus } = Mikrotik;
        const { username, role, name } = req.session;
        const { id, data } = req.body;
        try {
            if (mikrotikstatus) {
                await client.write("/ip/hotspot/ip-binding/remove", [
                    "=.id=" + id,
                ]);
                await notif(req.hostname, req.session.username, req.session.role, `Berhasil menghapus binding ${data['mac-address']}-${data.address}`);
                res.json({ success: true, title: "Hapus Binding", message: `Berhasil menghapus binding ${data['mac-address']}-${data.address}`, data: "" });
            } else {
                res.json({ success: false, title: "Hapus Binding", message: "Gagal hapus binding, mikrotik tidak terhubung", data: "" });
            }
        } catch (err) {
            res.json({ success: false, title: "Hapus Binding", message: `Gagal hapus binding, terjadi kesalahan : ${err.message}`, data: "" });
        };
    } else {
        res.json({ success: false, message: `Anda berada di user demo` })
    }
})

router.post('/bindingstatus', isAuthenticated, async (req, res) => {
    if (req.session.role.toLowerCase() !== 'demo') {
        const { mikrotikstatus } = Mikrotik;
        const { username, role, name } = req.session;
        const { action, id, data } = req.body;
        let message = action == true ? "menonaktifkan" : "mengaktifkan";
        try {
            if (mikrotikstatus) {
                await client.write("/ip/hotspot/ip-binding/set", [
                    "=.id=" + id,
                    `=disabled=${action == true ? "true" : "false"}`,
                ])
                await notif(req.hostname, req.session.username, req.session.role, `Berhasil ${message} binding ${data['mac-address']}-${data.address}`);
                res.json({ success: true, title: "Binding", message: `Berhasil ${message} binding ${data['mac-address']}-${data.address}`, data: "" });
            } else {
                res.json({ success: false, title: "Binding", message: `Gagal ${message} binding, mikrotik tidak terhubung`, data: "" });
            }
        } catch (err) {
            res.json({ success: false, title: "Binding", message: `Gagal ${message} binding, terjadi kesalahan : ${err.message}`, data: "" });
        };
    } else {
        res.json({ success: false, message: `Anda berada di user demo` })
    }
});

router.post('/loghotspot', isAuthenticated, async (req, res) => {
    const { mikrotikstatus } = Mikrotik;
    try {
        if (mikrotikstatus) {
            const loghotspot = await client.write('/log/print');

            res.json({ success: true, title: "Log Hotspot", message: "Berhasil mendapatkan log hotspot", data: loghotspot });
        } else {
            res.json({ success: false, title: "Log Hotspot", message: "Gagal mendapatkan log hotspot, mikrotik tidak terhubung", data: "" });
        }
    } catch (err) {
        res.json({ success: false, title: "Log Hotspot", message: `Gagal mendapatkan log hotspot, terjadi kesalahan : ${err.message}`, data: "" });
    }
})

router.post('/getfilebannerjs', isAuthenticated, async (req, res) => {
    const { mikrotikstatus } = Mikrotik;
    if (mikrotikstatus) {
        try {
            let response = await client.write('/file/print', [
                '?name=flash/HotspotClarice/banner.js'
            ]);
            response = response.length > 1 ? response : response[0];
            logg(true, `Berhasil mendapatkan data banner.js`)
            res.json({ success: true, title: `Banner Hotspot`, message: `Berhasil mendapatkan data banner.js`, response: response });
        } catch (err) {
            logg(false, `Gagal mendapatkan data banner.js, error: ${err.message}`);
            res.json({ success: false, title: `Banner Hotspot`, message: `Gagal mendapatkan data banner.js`, response: err.message });
        }
    } else {
        logg(false, `Mikrotik tidak terhubung`)
        res.json({ success: false, title: `Banner Hotspot`, message: `Mikrotik tidak terhubung` });
    }
});

router.post('/updatebannerjs', isAuthenticated, async (req, res) => {
    if (req.session.role.toLowerCase() !== "demo") {
        const { mikrotikstatus, mikrotikidentity } = Mikrotik;
        const { id, contents, data } = req.body;
        if (mikrotikstatus) {
            try {
                if (!contents) {
                    es.json({ success: false, message: `Gagal merubah content banner` })
                }
                await client.write('/file/set', [
                    '=.id=' + id,
                    '=contents=' + contents,
                ])
                // console.log(data)
                logg(true, `Berhasil merubah content banner`);
                let pesan = `List data banner :\n`;
                data.forEach(function (item) {
                    if (item.alt !== "" && item.link !== "") {
                        pesan += `\n\n${item.id}. ${item.alt}\nLink Gambar : ${item.link} `;
                    }
                });
                await notif(req.hostname, req.session.username, req.session.role, `Berhasil mengupdate banner ${mikrotikidentity}\n\n${pesan}`);
                res.json({ success: true, title: `Ubah Banner Hotspot`, message: `Berhasil merubah content banner` })
            } catch (err) {
                logg(false, `Gagal merubah content banner, error: ${err}`);
                res.json({ success: false, title: `Ubah Banner Hotspot`, message: `Gagal merubah content banner`, response: err.message });
            }
        } else {
            logg(false, `Mikrotik tidak terhubung`)
            res.json({ success: false, title: `Ubah Banner Hotspot`, message: `Mikrotik tidak terhubung` });
        }
    } else {
        res.json({ success: false, title: `Ubah Banner Hotspot`, message: `Anda berada di user demo` })
    }
})

router.post('/logoutuser', isAuthenticated, async (req, res) => {
    const { mikrotikstatus, mikrotikidentity } = Mikrotik;
    const { id, user, mac } = req.body;
    const message = id ? `melogout user ${id}-${mac}` : `melogout semua user ${user}`
    if (mikrotikstatus) {
        try {
            let aktifuser;
            if (!id) {
                aktifuser = await client.write('/ip/hotspot/active/print' , [
                    '?user=' + user
                ]);

                let count = 0;
                await Promise.all(aktifuser.map(async user => {
                    // console.log(`${count}. ${user['.id']}`);
                    await client.write('/ip/hotspot/active/remove', [
                        '=.id=' + user['.id'],
                    ]);
                    count++;
                }));
            } else {
                aktifuser = await client.write('/ip/hotspot/active/remove', [
                    "=.id=" + id,
                ])
            }
            await notif(req.hostname, req.session.username, req.session.role, `Berhasil ${message}`);
            res.json({ success: true, title: `User Logout`, message: `Berhasil ${message}` });
        } catch (err) {
            logg(false, `Gagal merubah content banner, error: ${err}`);
            res.json({ success: false, title: `User Logout`, message: `Gagal ${message}`, response: err.message });
        }
    } else {
        logg(false, `Mikrotik tidak terhubung`)
        res.json({ success: false, title: `User Logout`, message: `Mikrotik tidak terhubung` });
    }
})

router.post("/logout", isAuthenticated, async (req, res) => {
    const ip = req.headers['x-forwarded-for']
        ? `${req.headers['x-forwarded-for']}`
        : `${req.ip == "::1" ? "127.0.0.1" : req.ip.replace("::ffff:", "")}`
    const username = req.session.username;
    try {
        req.session.destroy();
        res.json({ success: true, title: `Autentikasi`, message: `Berhasil Logout` })
    } catch (err) {
        res.json({ success: false, title: `Autentikasi`, message: `Gagal Logout` })
    }
})

router.use((req, res) => {
    res.status(404).send('<html><head><link rel="icon" type="image/x-icon" href="https://merch.mikrotik.com/cdn/shop/files/512.png"><title>404</title></head><body></body></html>');
});

module.exports = {
    router,
};