const { io, isAuthenticated } = require('./server');
const { logg, Mikrotik } = require('./main');
const { client } = require('./mikrotik');

async function funresource() {
    try {
        const hasil = await client.write('/system/resource/print');
        return { success: true, data: hasil};
    } catch (err) {
        return { success: false, data: "", err: err };
    }
}

async function funuserhotspotaktif() {
    try {
        const hasil = await client.write('/ip/hotspot/active/print');
        return { success: true, data: hasil };
    } catch (err) {
        return { success: false, data: "", err: err };
    }
}

async function funqueuesimple() {
    try {
        const hasil = await client.write('/queue/simple/print');
        return { success: true, data: hasil };
    } catch (err) {
        return { success: false, data: "", err: err };
    };
}

async function funlisthosts() {
    try {
        const hasil = await client.write('/ip/hotspot/host/print');
        return { success: true, data: hasil };
    } catch (err) {
        return { success: false, data: "", err: err };
    };
}

async function startsocket(status) {
    try {
        if (status) {
            logg(true, `Memulai socketio dengan interval`);
            io.on('connection', (socket) => {
                logg(true, "Klien socket berhasil terhubung");
            
                const intervalId = setInterval(async () => {
                    if (isAuthenticated) {
                        try {
                            const resource = await funresource();
                            socket.emit('resource', resource);
                            const userhotspotaktif = await funuserhotspotaktif();
                            socket.emit('userhotspot', userhotspotaktif);
                            const queuesimple = await funqueuesimple();
                            socket.emit('queuesimple', queuesimple);
                            const hosts = await funlisthosts();
                            socket.emit('hosts', hosts);
                        } catch (err) {
                            logg(false, `Gagal mengirim data: ${err.message}`);
                            clearInterval(intervalId);
                        }
                    }
                }, 7000);
            
                socket.on('disconnect', () => {
                    logg(false, "Klien socket terputus");
                    clearInterval(intervalId);
                });
            });
        } else {
            logg(true, `Menghentikan socketio`);
        }
    } catch (err) {
        logg(false, `Gagal memulai atau menghentikan socketio, kesalahan : ${err.message}`);
    }
}

module.exports = {
    startsocket
}