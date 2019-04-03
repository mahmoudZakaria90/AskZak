const callSendAPI = require("./callSendAPI");

module.exports = {
  sendListTemplate(recipientId, elements) {
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
            elements
          }
        }
      }
    };

    callSendAPI(messageData);
  },
  sendTextMessage(recipientId, messageText) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: messageText,
        metadata: "DEVELOPER_DEFINED_METADATA"
      }
    };

    callSendAPI(messageData);
  }
};
