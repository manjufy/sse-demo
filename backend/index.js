const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

let clients = [];
let events = [];
// middleware for GET /events
const eventHandler = (req, res, next) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    }

    res.writeHead(200, headers);

    // right after client opens connection send all the events
    const data = `data: ${JSON.stringify(events)}\n\n`;
    res.write(data);
    const clientId = Date.now();
    const newClient = {
        id: clientId,
        res
    };

    clients.push(newClient);
    req.on('close', () => {
        console.log(`${clientId} Connection closed`);
        clients = clients.filter(c => c.id !== clientId);
    })
};

sendEventsToAll = (newEvent) => {
    clients.forEach(c => c.res.write(`data: ${JSON.stringify(newEvent)}\n\n`))
}

// Middlware for POSt /event
const addEvent = (req, res, next) => {
    const newEvent = req.body;
    events.push(newEvent);
    // send recently added event as POST result
    res.json(newEvent);
    // invoke interate and send
    return sendEventsToAll(newEvent)
}

// set CORS and bodyParser middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// endpoints
app.get('/', (req, res) => {
    res.send('SSE API')
})
app.post('/event', addEvent);
app.get('/events', eventHandler);
app.get('/status', (req, res) => res.json({clients: clients.length}));

const PORT = 3002;

app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`)
});