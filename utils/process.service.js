import Customer from '../models/customer.model.js';
import sendSms from './sms.js';

import {
    sendCarpetOrder,
    sendCarpetInvoiceEmail,

} from './invoice.service.js';
// import {
//     sendOrderConfirmationEmail, 
//     sendInvoiceEmail, 

// } from './utils/invoice.service.js';
export const processEmailAndSMS = async (savedOrder, reqBody) => {
    const {
        email,
        phone,
        first_name,
        last_name,
        order_no, 
        isSaveLocation
    } = reqBody;
    const {
        delivery_fee
    } = savedOrder;

    let total_fee;

    console.log(`Pickup Option: ${savedOrder.pickup_option}`);

    if (savedOrder.pickup_option == "pickup_and_drop") {
        total_fee = delivery_fee + 100;
        console.log(`total fee for pickup and drop ${total_fee}`);
        
    } else {
        total_fee = delivery_fee;
        console.log(`total fee for pickup and drop ${total_fee}`);
    }
    

    console.log("saved location", savedOrder.delivery_address);
    console.log("isSaveLocation", isSaveLocation);


        // id isSaveLocation is true, save the location to the customer
    if (isSaveLocation) {
        await Customer.findByIdAndUpdate({
            _id: savedOrder.customer
        }, {
            $set: {
                address: {
                    location: savedOrder.delivery_address.location,
                    building: savedOrder.delivery_address.building,
                    room_no: savedOrder.delivery_address.room_no,
                    lat: savedOrder.delivery_address.latitude,
                    long: savedOrder.delivery_address.longitude
                }
            }
        }, {
            new: true,
            useFindAndModify: false
        });
    }

    console.log(`phone ${phone} && email ${email}`);

    // payment to dropby
    await sendCarpetInvoiceEmail(email, {
        ...savedOrder.toObject(),
        first_name,
        last_name,
        email, 
        total_fee: total_fee
    });

    // products
    await sendCarpetOrder(email, {
        ...savedOrder.toObject(),
        first_name,
        last_name,
        email,

    });



    // send sms
    const message = `An order has been placed with order number ${order_no} from ${first_name} ${last_name} their phone number is ${phone}`;

    // const admin_phone_1 = "254707022354"
    // const admin_phone_2 = "254741976860"
    const admin_phone_3 = "254704416244"
    const admin_phone_4 = "254717391355"
    const admin_phone_5 = "254792784748" 

    // // await sendSms(message, admin_phone_1);
    // // await sendSms(message, admin_phone_2);
    await sendSms(message, admin_phone_3);
    await sendSms(message, admin_phone_4);
    await sendSms(message, admin_phone_5);
    // await sendSms(message, admin_phone_2);

    // push order to customer
    await Customer.findByIdAndUpdate({
        _id: savedOrder.customer
    }, {
        $push: {
            carpets: savedOrder._id
        }
    }, {
        new: true
    });
}


export const processOrderEmailAndSMS = async (savedOrder, reqBody) => {
    const {
        email,
        phone,
        first_name,
        last_name,
        order_no, 
        isSaveLocation
    } = reqBody;
    const {
        errand_fee,
        delivery_fee
    } = savedOrder;

    const total_fees = delivery_fee + errand_fee;

    // id isSaveLocation is true, save the location to the customer
    if (isSaveLocation) {
        console.log(`saving location ${savedOrder.delivery_address}`);
        await Customer.findByIdAndUpdate({
            _id: savedOrder.customer
        }, {
            $set: {
                address: {
                    location: savedOrder.delivery_address.location,
                    building: savedOrder.delivery_address.building,
                    room_no: savedOrder.delivery_address.room_no,
                    lat: savedOrder.delivery_address.latitude,
                    long: savedOrder.delivery_address.longitude
                }
            }
        }, {
            new: true,
            useFindAndModify: false
        });
    }



    console.log(`phone ${phone} && email ${email}`);
    await sendOrderConfirmationEmail(email, {
        ...savedOrder.toObject(),
        first_name,
        last_name,
        email
    });
    await sendInvoiceEmail(email, {
        ...savedOrder.toObject(),
        first_name,
        last_name,
        email,
        total_fees
    });

    // send sms
    const message = `An order has been placed with order number ${order_no} from ${first_name} ${last_name} their phone number is ${phone}`;

    // const admin_phone_1 = "254707022354"
    // const admin_phone_2 = "254741976860"
    const admin_phone_3 = "254704416244"
    const admin_phone_4 = "254717391355"
    const admin_phone_5 = "254792784748" 

    await sendSms(message, admin_phone_3);
    await sendSms(message, admin_phone_4);
    await sendSms(message, admin_phone_5);

    // push order to customer
    await Customer.findByIdAndUpdate({
        _id: savedOrder.customer
    }, {
        $push: {
            orders: savedOrder._id
        }
    }, {
        new: true,
        useFindAndModify: false
    });


    // 
}