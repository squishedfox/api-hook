const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/text');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('No-Cache', 'true')
    setTimeout(() => {
        console.debug(req.query);
        const text = req.query.q;
        res.send('Hello World, ' + text);
    }, 500)
});
app.listen(3000, () => console.log('Server running on port 3000'));