import axios from "axios";

export default async function sendSMS(message, phone) {
    const url = process.env.SMS_BULK_URL;
    const partnerID = process.env.PARTNER_ID;
    const apikey = process.env.API_KEY;

    const shortcode = process.env.SHORTCODE;

    try {
        const response = await axios.post(url, {
            smslist: [{
                partnerID: partnerID,
                apikey: apikey,
                shortcode: shortcode,
                message: message,
                mobile: phone,
            }, ],
        });
        // console.log(response);
        // return response.data;
    } catch (error) {
        // console.error(error);
        throw error; // Rethrow the error so it can be handled by the caller
    }
}