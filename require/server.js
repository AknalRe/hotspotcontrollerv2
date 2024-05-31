const { logg, Mikrotik, moment, APP_NAME, APP_ENV, APP_DEBUG, APP_PORT, APP_TITLE, APP_AUTHOR } = require('./main');
const { CekTotalUserHotspot } = require("./mikrotikfunction");

const port = parseInt(APP_PORT || 3000);

const http = require('http');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);

app.set("view engine", "ejs");
app.use(express.static('public'));

app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use('/css', express.static('views/styles'));
// app.use('/js', express.static('views/scripts'));

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'a01wOUAH8tWGte9GSVA33rGnXjyNnfGH',
  resave: false,
  saveUninitialized: true,
  store: new session.MemoryStore(),
  cookie: { maxAge: 800000 }
}));

app.use((req, res, next) => {
  const forwardedFor = req.headers['x-real-ip'] || req.headers['x-forwarded-for'];
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(ip => ip.trim());
    req.ip = ips[0];
  } else {
    next();
  }
  next();
});

app.use((req, res, next) => {
  let method = req.method == 'GET' ? 'GET' : req.method == 'POST' ? '\x1b[31mPOST\x1b[0m' : req.method;
  try {
    if (res.statusCode !== 404) {
      const logMessage = req.session.username
        ? `${method} - ${req.url} - ${req.session.username}/${req.session.role}`
        : `${method} - ${req.url}`;
      const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for']
        ? `${req.headers['x-real-ip'] || req.headers['x-forwarded-for']}`
        : `${req.ip == "::1" ? "127.0.0.1" : req.ip.replace("::ffff:", "")}`
      logg(true, `${ip} - ${logMessage}`);
    }
  } catch (err) {
    const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for']
      ? `${req.headers['x-real-ip'] || req.headers['x-forwarded-for']}`
      : `${req.ip == "::1" ? "127.0.0.1" : req.ip}`
    logg(false, `${ip} - ${method} - ${req.url}`);
  }

  next();
});

app.use((req, res, next) => {
  if (req.session && req.session.lastAccess) {
    const now = new Date();
    const elapsedTime = now - req.session.lastAccess;
    const maxAge = req.session.cookie.maxAge;

    if (elapsedTime > maxAge) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
        } else {
          console.log('Session has been destroyed due to inactivity');
        }
      });
    }
  }
  req.session.lastAccess = new Date();
  next();
});

async function startServer(port) {
  return new Promise((resolve, reject) => {
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logg(false, `Port ${port} sudah digunakan. Mencoba port lain...`)
        function getRandomPort() {
          return Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024;
        }

        let randomPort = getRandomPort();
        startServer(port + randomPort).then(resolve).catch(reject);
      } else {
        logg(false, `Kesalahan lain: ${error.message}`)
        reject(error);
      }
    });

    server.on('listening', () => {
      const serverPort = server.address().port;
      const isWindows = process.platform === 'win32';
      const chromeCommand = isWindows ? 'start chrome' : 'google-chrome';

      // Buka Chrome otomatis
      //   exec(`${chromeCommand} http://localhost:${port}`, (error, stdout, stderr) => {
      //     if (error) {
      //       console.error(`Kesalahan membuka Chrome: ${error.message}`);
      //       reject(error);
      //     }
      //   });
      //   resolve({ success: true, port: serverPort });
      logg(true, `Server berhasil dimulai pada port ${serverPort}`)
    });

    server.listen(port);
  });
}

async function start() {
  await startServer(port);
}

const isAuthenticated = async (req, res, next) => {
  const { mikrotikstatus } = Mikrotik;
  if (req.session && req.session.username) {
    const username = req.session.username;
    const role = req.session.role;
    const userData = await CekTotalUserHotspot();

    const user = Object.values(userData.data).find(
      (user) => user.name === username && user.profile === role
    );

    if (user) {
      return next();
    }
  } else {
    const data = {
      auth: false,
      mikrotik: mikrotikstatus,
      title: APP_TITLE,
      author: APP_AUTHOR,
      user_name: req.session.name ? req.session.name : '',
      user_role: req.session.role ? req.session.role : '',
      name_page: `Login - ${APP_TITLE}`,
      scriptglobal: "scripts/script",
      scriptlocal: "scripts/login",
      footer: "footer",
      style: "style",
      navbar: "navbar/login",
      page: "partials/login",
    };
    res.render('index', data);
  }
};

app.use('/static', isAuthenticated, express.static('views/public'));

module.exports = {
  start,
  isAuthenticated,
  app,
  io,
  router,
}