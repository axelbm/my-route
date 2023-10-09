import env from "env-var";

export const GOOGLE_API_TOKEN = env.get("GOOGLE_API_TOKEN").required().asString();
export const GOOGLE_API_URL = env.get("GOOGLE_API_URL").default('https://maps.googleapis.com/maps/api/directions/json').asString();

export const PORT = env.get("PORT").default(3000).asPortNumber();

export const ROUTES_PATH = env.get("ROUTES_PATH").default('./data/routes.yaml').asString();

export const INFLUX_URL = env.get("INFLUX_URL").default('localhost:8086').asString();
export const INFLUX_ORG = env.get("INFLUX_ORG").required().asString();
export const INFLUX_BUCKET = env.get("INFLUX_BUCKET").required().asString();
export const INFLUX_TOKEN = env.get("INFLUX_TOKEN").required().asString();

export const JOB_SCHEDULE = env.get("JOB_SCHEDULE").default('0 * * * * *').asString();
export const RUN_ON_START = env.get("RUN_ON_START").default('false').asBoolStrict();