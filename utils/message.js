// // Step 1: Change the import syntax
// import axios from 'axios';

// function sendMessage(data) {
//     try {        
//         const config = {
//             method: 'post',
//             url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
//             headers: {
//                 'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
//                 'Content-Type': 'application/json'
//             },
//             data: data
//         };
    
//         return axios(config);
//     } catch (err) {
//         return err;
//     }
// }

// function getTextMessageInput(recipient, text) {
//     return JSON.stringify({
//         "messaging_product": "whatsapp",
//         "preview_url": false,
//         "recipient_type": "individual",
//         "to": recipient,
//         "type": "text",
//         "text": {
//             "body": text
//         }
//     });
// }

// // Step 2: Export functions using ES6 module syntax
// export {
//     sendMessage,
//     getTextMessageInput
// };