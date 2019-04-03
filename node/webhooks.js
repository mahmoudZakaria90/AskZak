const callSendAPI = require("./callSendAPI");

module.exports = {
  sendListTemplate(recipientId, elements, text, start) {
    const messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "list",
            top_element_style: "compact",
            elements,
            buttons: [
              {
                title: "View More",
                payload: JSON.stringify({
                  start: elements.length + start,
                  text
                }),
                type: "postback"
              }
            ]
          }
        }
      }
    };

    callSendAPI(messageData);
  },
  sendTextMessage(recipientId, messageText, callback) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: messageText,
        metadata: "DEVELOPER_DEFINED_METADATA"
      }
    };

    callSendAPI(messageData, callback);
  }
};
