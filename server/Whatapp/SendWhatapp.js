const axios = require("axios");

const sendWhatsAppMessage = async (to, templateName, headerDocument, bodyParams) => {
  console.log("wghtapp save")
  console.log(to);
  console.log(headerDocument)
  console.log(templateName);
  try {
    console.log("📩 Sending WhatsApp Message...");

    // ✅ Format phone number
    to = to.replace(/\D/g, ""); // Remove non-numeric characters
    if (!to.startsWith("91")) to = "91" + to; // Ensure 91 is present
    to = "+" + to; // Ensure it has '+'

    console.log("📞 Formatted Number:", to);

    const API_URL = "https://wb.omni.tatatelebusiness.com/whatsapp-cloud/messages";
    const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Iis5MTg1MjcyODg5MzgiLCJwaG9uZU51bWJlcklkIjoiNDgwNTg4MDkxNzk5NDkwIiwiaWF0IjoxNzI4NTU3MDQ3fQ.jOY6HSv88KZja3dsml3EaUQWrepRDhezsSMZ5IfcUZo'; // Replace with your actual token

    if (!AUTH_TOKEN || AUTH_TOKEN === "your_token_here") {
      throw new Error("⚠️ WhatsApp AUTH_TOKEN is missing! Set it in environment variables.");
    }

    // ✅ Prepare payload
    const payload = {
      to,
      type: "template",
      source: "external",
      template: {
        name: templateName,
        language: { code: "en" },
        components: [],
      },
    };

    if (headerDocument) {
      payload.template.components.push({
        type: "header",
        parameters: [
          {
            type: "document",
            document: {
              link: headerDocument.link,
              filename: headerDocument.filename,
            },
          },
        ],
      });
    }

    if (bodyParams && bodyParams.length) {
      payload.template.components.push({
        type: "body",
        parameters: bodyParams.map((text) => ({ type: "text", text })),
      });
    }

    // ✅ Send API Request
    const response = await axios.post(API_URL, payload, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Message Sent Successfully:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("❌ API Error:", error.response.data);
    } else if (error.request) {
      console.error("❌ No Response Received:", error.request);
    } else {
      console.error("❌ Request Failed:", error.message);
    }
  }
};

module.exports=sendWhatsAppMessage

