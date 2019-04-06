const config = require("config");
/*
 * Be sure to setup your config values before running this code. You can
 * set them using environment variables or modifying the config file in /config.
 *
 */

module.exports = {
  // Generate a page access token for your page from the App Dashboard
  PAGE_ACCESS_TOKEN: process.env.MESSENGER_PAGE_ACCESS_TOKEN
    ? process.env.MESSENGER_PAGE_ACCESS_TOKEN
    : config.get("pageAccessToken"),
  // App Secret can be retrieved from the App Dashboard
  APP_SECRET: process.env.MESSENGER_APP_SECRET
    ? process.env.MESSENGER_APP_SECRET
    : config.get("appSecret"),

  // Arbitrary value used to validate a webhook
  VALIDATION_TOKEN: process.env.MESSENGER_VALIDATION_TOKEN
    ? process.env.MESSENGER_VALIDATION_TOKEN
    : config.get("validationToken"),

  // URL where the app is running (include protocol). Used to point to scripts and
  // assets located at this address.
  SERVER_URL: process.env.SERVER_URL
    ? process.env.SERVER_URL
    : config.get("serverURL"),

  SEARCH_API_KEY: process.env.SEARCH_API_KEY
    ? process.env.SEARCH_API_KEY
    : config.get("SearchAPIKey"),

  SEARCH_ID: process.env.SEARCH_ID
    ? process.env.SEARCH_ID
    : config.get("SearchID")
};
