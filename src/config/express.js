const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const exceptionHandler = require('express-exception-handler');
const error = require('../api/middlewares/error');
const { protectRoutes } = require('./config');
const { requestLogger } = require('./logger');

// Importa middlewares de segurança
const {
    corsMiddleware,
    helmetMiddleware,
    sanitizeInput,
    securityHeaders,
    logSuspiciousActivity
} = require('../api/middlewares/security');
const { generalLimiter } = require('../api/middlewares/rateLimiter');

exceptionHandler.handle();

const app = express();

// Logger de requisições (primeiro)
app.use(requestLogger);

// Aplica middlewares de segurança
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(securityHeaders);
app.use(generalLimiter);
app.use(logSuspiciousActivity);

// Middlewares de parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInput);
app.use(cookieParser(process.env.COOKIE_SECRET));

// Configuração do middleware de sessão
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(flash());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../api/views'));
app.use(express.static(path.join(__dirname, '../public')));

global.WhatsAppInstances = {};

// Middleware existente
const routes = require('../api/routes/');

app.use('/', routes);

app.use(error.handler);

module.exports = app;
