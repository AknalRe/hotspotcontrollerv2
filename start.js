const { logg } = require("./require/main");
const { start, app } = require("./require/server");
const { router } = require("./require/routes");
const { connect } = require("./require/mikrotik");
const { startsocket } = require("./require/socket");

start()
    .then((result) => {
    })
    .catch((error) => {
        console.error("Terjadi kesalahan:", error);
    });

connect()
    .then((result) => {
        // console.log(result);
        if (result.success) {
            startsocket(true);
        }
    }).catch((error) => {
        console.error('Terjadi kesalahan:', error);
    });

app.use('/', router);