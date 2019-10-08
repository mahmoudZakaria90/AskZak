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
                image_url: "https://scontent-ber1-1.xx.fbcdn.net/v/t1.0-9/58420180_814322605618434_8774108935750680576_n.jpg?_nc_cat=110&_nc_oc=AQlVHx1yjwhsTQgZaVln99CqCzt-dNbZYBNkVuVyTqmKS0dAYLzbAmWE--lxrSU7iV6fcIG02244PyjnOxyoXV5x&_nc_ht=scontent-ber1-1.xx&oh=cdbb1049a5cbd316df003a2c09887c22&oe=5E38B97D",
                subtitle: "Ask me anything related to the web industry.",
                default_action: {
                  type: "web_url",
                  url:
                    "https://www.facebook.com/AskZak-802208680163160/?modal=admin_todo_tour",
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
