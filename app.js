/*
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* jshint node: true, devel: true */
"use strict";

const bodyParser = require("body-parser"),
  crypto = require("crypto"),
  express = require("express"),
  fb = require("fb"),
  request = require("request");

const {sendListTemplate, sendTextMessage, sendShareComponent} = require("./webhooks");
const {
  PAGE_ACCESS_TOKEN,
  APP_SECRET,
  VALIDATION_TOKEN,
  SERVER_URL,
  SEARCH_API_KEY,
  SEARCH_ID
} = require("./tokens");

var app = express();
app.set("port", process.env.PORT || 5000);
app.set("view engine", "ejs");
app.use(bodyParser.json({verify: verifyRequestSignature}));
app.use(express.static("public"));

if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL && SEARCH_API_KEY && SEARCH_ID)) {
  console.error("Missing config values");
  process.exit(1);
}

/*
 * Use your own validation token. Check that the token used in the Webhook
 * setup is the same token used here.
 *
 */
app.get("/webhook", function (req, res) {
  console.log(req.query["hub.mode"], req.query["hub.verify_token"]);
  if (req.query["hub.mode"] === "subscribe" && req.query["hub.verify_token"] === VALIDATION_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page.
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
app.post("/webhook", function (req, res) {
  var data = req.body;
  console.log("msg received!");
  // Make sure this is a page subscription
  if (data.object == "page") {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function (pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;

      // Iterate over each messaging event
      pageEntry.messaging.forEach(function (messagingEvent) {
        if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        } else if (messagingEvent.postback) {
          receivedPostback(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know you've
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200);
  }
});

/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    var elements = signature.split("=");
    var method = elements[0];
    var signatureHash = elements[1];

    var expectedHash = crypto.createHmac("sha1", APP_SECRET).update(buf).digest("hex");

    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message'
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 *
 * For this example, we're going to echo any text that we get. If we get some
 * special keywords ('button', 'generic', 'receipt'), then we'll send back
 * examples of those bubbles to illustrate the special message bubbles we've
 * created. If we receive a message with an attachment (image, video, audio),
 * then we'll simply confirm that we've received the attachment.
 *
 */
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var isEcho = message.is_echo;
  var messageId = message.mid;
  var appId = message.app_id;
  var metadata = message.metadata;

  // You may get a text or attachment but not both
  var messageText = message.text;
  var messageAttachments = message.attachments;
  var quickReply = message.quick_reply;

  if (isEcho) {
    // Just logging message echoes to console
    console.log("Received echo for message %s and app %d with metadata %s", messageId, appId, metadata);
    return;
  } else if (quickReply) {
    var quickReplyPayload = quickReply.payload;
    console.log("Quick reply for message %s with payload %s", messageId, quickReplyPayload);

    sendTextMessage(senderID, "Quick reply tapped");
    return;
  }

  if (messageText) {
    passTextToGoogleSearch(senderID, messageText, 1);
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Unavailable, please use related keywords: html, css, JS");
  }
}

function passTextToGoogleSearch(senderID, text, start) {
  if ([
    "porn",
    "sex",
    "tits",
    "fuck",
    "ass",
    "a7a",
    "kossomk",
    "زبي",
    "زب",
    "باقلبي",
    "احا",
    "زوبري",
    "كسمك",
    "كس امك",
    "suicide"
  ].includes(text.toLowerCase())) {
    sendTextMessage(senderID, `No result for ${text}, watch your language u big boy!`);
  } else {
    const url = `https://www.googleapis.com/customsearch/v1?key=${SEARCH_API_KEY}&cx=${SEARCH_ID}&q=${encodeURI(text)}&start=${start}&safe=high&num=4`;
    request(url, {
      json: true
    }, (err, res, body) => {
      if (!err && res.statusCode === 200 && Number(body.searchInformation.totalResults)) {
        sendListTemplate(senderID, createListTemplateElements(body.items), text, start++);
      } else {
        sendTextMessage(senderID, `No result for ${text}, please use related keywords: html, css, JS`);
      }
    });
  }
}

function createListTemplateElements(target) {
  const elements = [];
  target.forEach(item => {
    const obj = {
      title: item.title,
      subtitle: item.displayLink,
      image_url: item.pagemap
        ? item.pagemap.cse_image
          ? item.pagemap.cse_image[0].src
          : null
        : null,
      default_action: {
        type: "web_url",
        url: item.link,
        messenger_extensions: false,
        webview_height_ratio: "tall"
      }
    };
    elements.push(obj);
  });
  return elements;
}

/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 *
 */
function receivedPostback(event) {
  const {postback} = event;
  var senderID = event.sender.id;
  let text;

  // When a postback is called, we'll send a message back to the sender to
  // let them know it was successful
  if (postback.title === "Get Started" || postback.title === "بدء الاستخدام") {
    fb.api(senderID, {
      access_token: PAGE_ACCESS_TOKEN
    }, user => {
      let name = user["first_name"];
      text = `Hello and welcome ${name} to AskZak bot, you can ask me anything related to the web industry and I will provide you the best answers!`;

      sendTextMessage(senderID, text, function () {
        sendTextMessage(senderID, "To get you started use one of these keywords: `html`, `php`, `test automation`, ...etc. Or you can normally ask by typing any kind of a question like: `what is java`?", function () {
          sendShareComponent(senderID);
        });
      });
    });
  } else if (postback.title === "View More") {
    const payload = JSON.parse(postback.payload);
    passTextToGoogleSearch(senderID, payload.text, payload.start + 1);
  }
}

// Start server
// Webhooks must be available via SSL with a certificate signed by a valid
// certificate authority.
app.listen(app.get("port"), function () {
  console.log("Node app is running on port", app.get("port"));
});

module.exports = app;
