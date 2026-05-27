const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { connectDB } = require('./config/db');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

require('dotenv').config();

async function start() {
    const app = express();

    // Security
    app.use(helmet({ crossOriginResourcePolicy: false }));

    // Middleware
    app.use(cors({ origin: '*', credentials: true }));
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('dev'));

    // Health
    app.get('/health', (req, res) => res.json({ ok: true }));

    // Routes
    app.use('/api', routes);
    app.use('/', require('./routes/catchall'));

    // Error handling
    app.use(notFound);
    app.use(errorHandler);

    const port = process.env.PORT || 4000;
    await connectDB();
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`API running at http://localhost:${port}`);
    });
}

start().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', err);
    process.exit(1);
});

