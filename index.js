import { start } from './app.js';
import './fetch-route.js';
import { read } from './routes.js';
import { AVOID, fetchRoute } from './fetch-route.js';
import * as cron from 'node-cron';
import { Gauge } from 'prom-client';
import { getWriteApi, writeRoutePoint } from './influx-connection.js';
import { JOB_SCHEDULE, RUN_ON_START } from './config.js';

const routeDurationGauge = new Gauge({
    name: 'route_duration',
    help: 'Duration of a route',
    labelNames: ['name'],
});
const routeDurationInTrafficGauge = new Gauge({
    name: 'route_duration_in_traffic',
    help: 'Duration of a route in traffic',
    labelNames: ['name'],
});
const routeDistanceGauge = new Gauge({
    name: 'route_distance',
    help: 'Distance of a route',
    labelNames: ['name'],
});

start();


async function task() {
    const routes = read();

    const writeApi = getWriteApi('s');

    for (let route of routes) {
        const googleRoute = await fetchRoute(route.origin, route.destination, { avoid: [AVOID.TOLLS] });

        console.log('##############################################');
        console.log('name: ', route.name);
        console.log('duration: ', googleRoute.duration.text);
        console.log('duration_in_traffic: ', googleRoute.duration_in_traffic.text);
        console.log('distance: ', googleRoute.distance.text);

        routeDurationGauge.set({ name: route.name }, googleRoute.duration.value);
        routeDurationInTrafficGauge.set({ name: route.name }, googleRoute.duration_in_traffic.value);
        routeDistanceGauge.set({ name: route.name }, googleRoute.distance.value);

        writeRoutePoint({
            name: route.name,
            duration: googleRoute.duration.value,
            durationInTraffic: googleRoute.duration_in_traffic.value,
            distance: googleRoute.distance.value,
        }, writeApi)
    }

    writeApi.close();
}

cron.schedule(JOB_SCHEDULE, task);
if (RUN_ON_START) {
    task();
}