const express = require('express');
const {
    sequelize,
    mytable,
    AllData,
    Lastest_Records,
} = require('./api.js');

const app = express();
const port = 8080;

app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/node_modules'));


app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.get('/api/create', (req, res) => {
    var temp = req.query.temperature, ghi = req.query.ghi;
    var voltage = req.query.voltage, current = req.query.current, power = req.query.power;

    sequelize.sync().then(() => {
        return mytable.create({
            temperature: parseFloat(temp),
            ghi: parseFloat(ghi),
            voltage: parseFloat(voltage),
            current: parseFloat(current),
            power: parseFloat(power)
        })
    }).then(() => res.status(200).send('Sucess'))
        .catch(msg => res.send(400).sendFile('400.html'));
});

app.get('/ajax/table', (req, res) => {
    AllData().then(data => res.json(data)).catch(reason => res.status(400).sendFile('400.html'));
});

app.get('/ajax/chart', (req, res) => {
    const attr = req.query.param, limit = parseInt(req.query.limit);
    Lastest_Records(attr, limit).then(data => res.json(data)).catch(reason => res.status(400).sendFile('400.html'));
});

app.listen(port, 'localhost', () => {
    console.log(`Listening on  http://localhost:${port}`)
});
