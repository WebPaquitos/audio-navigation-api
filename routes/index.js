const express = require('express');
const ApiAiClient = require('apiai');
const router = express.Router();
const AiClient = new ApiAiClient('8fd7835cb9ea4a97849eb376652e3e4e');

router.post('/api/ai/request', (req, res) => {
    console.log(req.body);
    const text = req.body.text;
    AiClient.textRequest(text).then(({ result }) => {
        console.log(result);
        const { action, parameters } = result;
        let whereto = '';
        if (parameters) whereto = parameters.whereto;
        else return res.status(400).json({ error: 'say_target' });
        if (action === 'navigate') res.json({ target: whereto });
    }).catch(() => {
        console.log('error');
        res.status(400).json({ error: 'repeat_command' });
    });
});

module.exports = router;
