const cron = require("node-cron");
const clientt = require("../models/client");
const sendWhatsAppMessage = require("../Whatapp/BulkMesage");
const moment = require('moment-timezone');

cron.schedule("*/10 * * * * *", async () => {
    console.log("⏳ Checking for messages to send...");

    const batchSize = 1000;
    let page = 0;
    const currentISTDate = moment().tz("Asia/Kolkata").toDate();
    console.log(currentISTDate, "current date");

    while (true) {

        
        const clients = await clientt.find({
            messageStatus: true,
            reminderDate: { $lte: currentISTDate },
        })
        .skip(page * batchSize)
        .limit(batchSize);

        console.log(clients.length, "clients found");

        if (clients.length === 0) break;

        for (let client of clients) {
            try {
                console.log(`📩 Sending message to ${client}`);
                const mobileNumber = client?.mobile.replace(/^\+91/, "");
                console.log(mobileNumber)
                
                await sendWhatsAppMessage(
                    `+91${mobileNumber}`,
                    "crm_4",
                    `${client?.WhatappImage}`,
                    ["Galo Energy Pvt. Ltd.", `${client.Message}`, `${client.companymobile}`]
                );

                console.log(`✅ Message sent to ${client.mobile}: ${client.Message}`);

                // Calculate next reminder date
                console.log(client.reminderDays);
                let newdate = client?.reminderDays || 0;
                console.log(newdate);
                let nextReminderDate = moment().tz("Asia/Kolkata").add(newdate, 'days').toDate();
                console.log("Next reminder date:", nextReminderDate);

                // Update the reminder date
                const result = await clientt.updateOne(
                    { _id: client._id },
                    { $set: { reminderDate: nextReminderDate } }
                );

                console.log(result, "✅ Update result");

            } catch (error) {
                console.error(`❌ Error sending message to ${client.mobile}:`, error);
            }
        }

        page++;
    }
});




