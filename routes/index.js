const express = require('express');
const ApiAiClient = require('apiai');
const router = express.Router();
const path = require('path');

router.get('/alive', (req, res) => {
   res.json({message: 'I am alive'});
});

router.post('/api/request', (req, res) => {
    const text = req.body.text;
    const AiClient = new ApiAiClient(req.headers['dialog-flow-token']);
    const request = AiClient.textRequest(text, {
        sessionId: `${new Date().getTime()}`,
    });

    request.on('response', ({ result }) => {
        const { action, parameters } = result;
        let whereto = '';
        if (parameters) whereto = parameters.whereto;
        else return res.status(400).json({ error: 'say_target' });
        if (action === 'navigate') res.json({ target: whereto });
    });

    request.on('error', error => res.status(400).json({ error: 'repeat_command' }));

    request.end();
});

router.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = router;
