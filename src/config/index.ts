const DOMAIN_NAME = "sgcarplatechecksum.app";

const API_DOMAIN = `https://api.${DOMAIN_NAME}`;
export const LOOKUP_API_URL = process.env.API_URL || API_DOMAIN;
