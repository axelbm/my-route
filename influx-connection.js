import { InfluxDB, Point } from "@influxdata/influxdb-client";
import { INFLUX_URL } from "./config.js";
import { HealthAPI } from "@influxdata/influxdb-client-apis";

export const influx = new InfluxDB({
    url: INFLUX_URL,
    token: process.env.INFLUX_TOKEN
});
export const healthApi = new HealthAPI(influx);

export function getWriteApi(precision = 's', writeOptions = null) {
    return influx.getWriteApi(process.env.INFLUX_ORG, process.env.INFLUX_BUCKET, precision, writeOptions);
}

export function getQueryApi() {
    return influx.getQueryApi(process.env.INFLUX_ORG);
}

/**
 * @typedef RoutePoint
 * @property {string} name
 * @property {number} duration
 * @property {number} durationInTraffic
 * @property {number} distance
 * 
 */

export function writeRoutePoint(routePoint, writeApi = null) {
    let shouldClose = false;
    if (!writeApi) {
        writeApi = getWriteApi('s');
        shouldClose = true;
    }

    const point = new Point('route')
        .tag('name', routePoint.name)
        .floatField('duration', routePoint.duration)
        .floatField('duration_in_traffic', routePoint.durationInTraffic)
        .floatField('distance', routePoint.distance);

    writeApi.writePoint(point);
    // console.log('point written', point);

    if (shouldClose) {
        writeApi.close();
    }
}

export function getInfluxHealth() {
    return healthApi.getHealth();
}