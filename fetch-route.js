import axios from "axios";
import { GOOGLE_API_TOKEN, GOOGLE_API_URL } from "./config.js";
import { Location } from "./routes.js";

/**
 * @typedef {Object} FetchOptions
 * @property {DRIVING_MODE} mode
 * @property {TRAFFIC_MODEL} trafficModel
 * @property {AVOID[]} avoid
 * 
 */

/**
 * @typedef {Object} FetchedRoute
 * @property {{ text: string, value: number }} distance
 * @property {{ text: string, value: number }} duration
 * @property {{ text: string, value: number }} duration_in_traffic
 * @property {string} end_address
 * @property {{ lat: number, lng: number }} end_location
 * @property {string} start_address
 * @property {{ lat: number, lng: number }} start_location
 * @property {any} steps
 * @property {string} traffic_speed_entry
 * @property {string} via_waypoint
 */

/**
 * 
 * @param {string | Location} origin 
 * @param {string | Location} destination 
 * @param {FetchOptions} options
 * @returns {Promise<FetchedRoute>}
 */
export async function fetchRoute(origin, destination, options = {}) {
    if (typeof origin === 'object') {
        origin = `${origin.latitude},${origin.longitude}`;
    }
    if (typeof destination === 'object') {
        destination = `${destination.latitude},${destination.longitude}`;
    }

    const { data } = await axios.get(GOOGLE_API_URL, {
        params: {
            origin,
            destination,
            key: GOOGLE_API_TOKEN,
            departure_time: 'now',
            mode: options.mode || DRIVING_MODE.DRIVING,
            traffic_model: options.trafficModel || TRAFFIC_MODEL.BEST_GUESS,
            avoid: (options.avoid || []).join('|'),
        }
    });

    if (data.status !== 'OK') {
        throw new Error(data.error_message);
    }

    const result = data.routes[0]?.legs[0];

    return result;
}

/** @enum {string} */
export const DRIVING_MODE = {
    DRIVING: 'driving',
    WALKING: 'walking',
    BICYCLING: 'bicycling',
    TRANSIT: 'transit',
}

/** @enum {string} */
export const TRAFFIC_MODEL = {
    BEST_GUESS: 'best_guess',
    OPTIMISTIC: 'optimistic',
    PESSIMISTIC: 'pessimistic',
}

/** @enum {string} */
export const AVOID = {
    TOLLS: 'tolls',
    HIGHWAYS: 'highways',
    FERRIES: 'ferries',
    INDOOR: 'indoor',
}
