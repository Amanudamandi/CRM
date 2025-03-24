const axios = require('axios');

const sendWhatsAppMessage = async (to, templateName, headerDocument, bodyParams) => {
  const API_URL = 'https://wb.omni.tatatelebusiness.com/whatsapp-cloud/messages';
  const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Iis5MTg1MjcyODg5MzgiLCJwaG9uZU51bWJlcklkIjoiNDgwNTg4MDkxNzk5NDkwIiwiaWF0IjoxNzI4NTU3MDQ3fQ.jOY6HSv88KZja3dsml3EaUQWrepRDhezsSMZ5IfcUZo'; // Replace with your actual token
  console.log(to,"hello");
  const payload = {
    to,
    type: 'template',
    source: 'external',
    template: {
      name: templateName,
      language: { code: 'en' },
      components: []
    }
  };

  if (headerDocument) {
    payload.template.components.push({
      type: 'header',
      parameters: [
        {
          type: 'document',
          document: {
            link: headerDocument.link,
            filename: headerDocument.filename
          }
        }
      ]
    });
  }

  if (bodyParams && bodyParams.length) {
    payload.template.components.push({
      type: 'body',
      parameters: bodyParams.map(text => ({ type: 'text', text }))
    });
  }

  try {
    const response = await axios.post(API_URL, payload, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
    throw error;
  }
};


module.exports=sendWhatsAppMessage ;
