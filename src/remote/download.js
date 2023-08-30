const fs = require('fs');

module.exports = async function download(url, localPath) {
    const fetch = (await import('node-fetch')).default;
    const fetchResponse = await fetch(url);
    const buffer = Buffer.from(await fetchResponse.arrayBuffer());
    fs.writeFileSync(localPath, buffer);
};
