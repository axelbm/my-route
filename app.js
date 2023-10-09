import express from 'express';
import * as client from 'prom-client';
import { PORT } from './config.js';
import { getInfluxHealth } from './influx-connection.js';
import { read } from './routes.js';
import asyncHandler from 'express-async-handler';

const app = express();

// logging
app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const timestamp = new Date().toISOString();
        console.log(`${timestamp} - ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });

    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// get metrics
app.get('/metrics', asyncHandler(async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.send(await client.register.metrics());
}));

app.get('/health', asyncHandler(async (req, res) => {
    const influxHealth = await getInfluxHealth();
    const validRoutes = read().length;

    res.json({
        influx: influxHealth,
        routes: validRoutes,
    });
}));


// catch 404 and forward to error handler
app.all('*', (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;

    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    // res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.error(err.stack)

    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err,
        date: new Date()
    });
});

/**
 * Start the server
 * @param {number} port default 3000
 */
export function start(port = PORT) {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
}

export function stop() {
    app.close();
}

export default app;