import { ROUTES_PATH } from "./config.js";
import YAML from 'yaml';
import fs from 'fs';

/**
 * @typedef {Object} Route
 * @property {string} name
 * @property {Location} origin
 * @property {Location} destination
 */
export const Route = {};

/**
 * @typedef {Object} Location
 * @property {number} latitude
 * @property {number} longitude
 */
export const Location = {};


/**
 * 
 * @param {string} path 
 * @returns {Route[]}
 */
export function read(path = ROUTES_PATH) {
    try {
        const object = YAML.parse(fs.readFileSync(path, 'utf8'));
        return object.routes;
    } catch (e) {
        if (e.code == 'ENOENT') {
            console.log('Routes file not found, creating new one')
            fs.writeFileSync(path, YAML.stringify({ routes: [] }));
            return [];
        }

        throw e;
    }
}

/**
 * 
 * @param {Route[]} routes 
 * @param {string} path 
 */
export function write(routes, path = ROUTES_PATH) {
    const object = { routes };
    return fs.writeFileSync(path, YAML.stringify(object));
}

/**
 * 
 * @param {Route | Route[]} newRoutes
 * @param {string} path
 * @returns {Route[]}
 */
export function append(newRoutes, path = ROUTES_PATH) {
    if (!Array.isArray(newRoutes)) {
        newRoutes = [newRoutes];
    }

    const routes = read(path);
    routes.push(...newRoutes);
    write(routes, path);

    return routes;
}
