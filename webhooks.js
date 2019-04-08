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
  },
  sendShareComponent(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            image_aspect_ratio: "square",
            elements: [
              {
                title: "AskZak",
                image_url: "https://scontent-amt2-1.xx.fbcdn.net/v/t1.0-9/55840604_802209380163090_4085643487779749888_n.jpg?_nc_cat=109&_nc_ht=scontent-amt2-1.xx&oh=6e3e1d0f2773689142e452498d26e267&oe=5D49D702",
                subtitle: "Ask me anything related to the web industry.",
                default_action: {
                  type: "web_url",
                  url: "https://www.facebook.com/AskZak-802208680163160/?modal=admin_todo_tour",
                  webview_height_ratio: "full"
                },
                buttons: [
                  {
                    type: "element_share"
                  }
                ]
              }
            ]
          }
        }
      }
    };
    callSendAPI(messageData);
  }
};
