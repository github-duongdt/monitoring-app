const express = require('express');
const {
    sequelize,
    MainTable,
    TestTable,
    AllData,
    Lastest_Records,
    Drop,
} = require('./api.js');

const app = express();
const port = process.env.PORT || 8000,
    host = process.env.HOST || 'localhost',
    mode = process.env.MODE;

if (mode === "DEV") {
    table = TestTable;
}
else if (mode === "PRO") {
    table = MainTable;
}

app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/node_modules'));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.get('/api/create', (req, res) => {
    var temp = req.query.temperature, humidity = req.query.humidity,
        ghi = req.query.ghi, illuminance = req.query.illuminance;

    sequelize.sync().then(() => {
        return table.create({
            temperature: parseFloat(temp),
            humidity: parseFloat(humidity),
            illuminance: parseFloat(illuminance),
            ghi: parseFloat(ghi),
        })
    }).then(() => res.status(200).send('Sucess'))
        .catch(msg => res.send(500).sendFile('500.html'));
});

app.get('/api/delete', (req, res) => {
    var key = req.query.key;
    sequelize.sync().then(() => {
        Drop(table, key).then(() => res.status(200).send('Dropped'))
            .catch(() => res.sendStatus(403));
    });
});

app.get('/ajax/table', (req, res) => {
    sequelize.sync().then(() => {
        AllData(table).then(data => res.json(data)).catch(reason => res.status(500).sendFile('500.html'));
    }).catch((reason) => console.log(reason));
});

app.get('/ajax/chart', (req, res) => {
    const attr = req.query.param, limit = parseInt(req.query.limit);
    sequelize.sync().then(() => {
        Lastest_Records(attr, limit, table).then(data => res.json(data)).catch(reason => res.status(500).sendFile('500.html'));
    }).catch((reason) => console.log(reason));
});

app.listen(port, host, () => {
    console.log(`Listening on  http://${host}:${port}`)
});
