const axios = require("axios");

const sendWhatsAppMessage2 = async (to, templateName, headerImage, bodyTexts) => {
    console.log(headerImage, "image url");
    console.log(to, "no");
    console.log(bodyTexts, "hello");

    const API_URL = 'https://wb.omni.tatatelebusiness.com/whatsapp-cloud/messages';
    const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Iis5MTg1MjcyODg5MzgiLCJwaG9uZU51bWJlcklkIjoiNDgwNTg4MDkxNzk5NDkwIiwiaWF0IjoxNzI4NTU3MDQ3fQ.jOY6HSv88KZja3dsml3EaUQWrepRDhezsSMZ5IfcUZo';

    const payload = {
        to,
        type: "template",
        source: "external",
        template: {
            name: templateName,
            language: { code: "en" },
            components: [
                {
                    type: "header",
                    parameters: [{ type: "image", image: { link: headerImage } }],
                },
                {
                    type: "body",
                    parameters: bodyTexts.map((text) => ({ type: "text", text })),
                },
            ],
        },
    };

    try {
        console.log(payload, "payload is here");
        const response = await axios.post(API_URL, payload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${AUTH_TOKEN}`,
            },
        });

        console.log("✅ Message Sent:", response.data);

        // Check if the response contains a success status
        if (response.status === 200 || response.status === 201) {
            return { success: true, data: response.data };
        } else {
            return { success: false, error: "Unexpected status code", status: response.status };
        }
    } catch (error) {
        console.error("❌ Error Sending Message:", error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

module.exports = sendWhatsAppMessage2;







