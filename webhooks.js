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
                image_url:
                  "https://scontent-ber1-1.xx.fbcdn.net/v/t1.0-9/58384636_814322608951767_8229116691565510656_o.jpg?_nc_cat=110&_nc_eui2=AeEfMedDEuURdNTEbxfaP57Hryukk5fbX71XnVYG-qDwKGowrH5gXL-JWTMFcug-GpqsYllVdMZSW49NYN-gx5J7Qi68xU7ch0nI_5QtEYqJBw&_nc_ht=scontent-ber1-1.xx&oh=89b7912436810320db9780362e99c34a&oe=5D701EDF",
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
