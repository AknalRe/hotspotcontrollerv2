const { WEBHOOKN8N } = require('./main');
const webhookUrl = "http://172.17.0.2:5678/" + WEBHOOKN8N;

// async function main() {
//   const fetch = (await import('node-fetch')).default;
//   console.log(webhookUrl);

//   const response = await fetch(webhookUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       data: 'Contoh payload'
//     })
//   });

//   const result = await response.json();
//   console.log(result);
// }

// main().catch(console.error);

const insertsheet = async (data) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    
        const result = await response.json();
        return { success: true, msg: result.message };
    } catch(err) {
        return { success: false, msg: err.message };
    }
}

module.exports = {
    insertsheet
}