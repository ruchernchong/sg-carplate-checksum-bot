const DOMAIN_NAME = "sgcarplatechecksum.app";

const API_DOMAIN = `https://api.${DOMAIN_NAME}`;
export const LOOKUP_API_URL = process.env.LOOKUP_API_URL || API_DOMAIN;
