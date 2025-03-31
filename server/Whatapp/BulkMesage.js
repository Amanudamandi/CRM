const axios = require("axios");

const sendWhatsAppMessage2 = async (to, templateName, headerImage, bodyTexts) => {
    const API_URL = 'https://wb.omni.tatatelebusiness.com/whatsapp-cloud/messages';
    const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Iis5MTg1MjcyODg5MzgiLCJwaG9uZU51bWJlcklkIjoiNDgwNTg4MDkxNzk5NDkwIiwiaWF0IjoxNzI4NTU3MDQ3fQ.jOY6HSv88KZja3dsml3EaUQWrepRDhezsSMZ5IfcUZo';
    const SOURCE = "external"; // ✅ Defined SOURCE (Fixing Undefined Error)

    const payload = {
        to,
        type: "template",
        source: SOURCE,  // ✅ Now properly defined
        template: {
            name: templateName,
            language: { code: "en" },
            components: [
                {
                    type: "header",
                    parameters: [
                        {
                            type: "image",
                            image: { link: headerImage },
                        },
                    ],
                },
                {
                    type: "body",
                    parameters: bodyTexts.map((text) => ({ type: "text", text })),
                },
            ],
        },
    };

    try {
        const response = await axios.post(API_URL, payload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${AUTH_TOKEN}`,
            },
        });

        console.log("✅ Message Sent:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error Sending Message:", error.response?.data || error.message);
        return null;
    }
};
module.exports=sendWhatsAppMessage2;







