const express = require('express');
const {
    sequelize,
    AllData,
    Lastest_Records,
    Drop,
} = require('./api.js');

const app = express();
const port = process.env.PORT || 8000,
    host = process.env.HOST || 'localhost',
    mode = process.env.MODE || 'DEV';

if (mode === "DEV") {
    table = require('./api.js').TestTable;
}
else if (mode === "PRO") {
    table = require('./api.js').MainTable;
}

app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/node_modules'));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.get('/api/create', (req, res) => {
    var keys = ['temperature', 'humidity', 'ghi', 'illuminance'], newRecord = {}
    invalid = false;
    for (const key of keys) {
        if (isNaN(parseFloat(req.query[key]))) {
            invalid = true;
            break;
        } else {
            newRecord[key] = parseFloat(req.query[key]);
        }
    }
    if (invalid) {
        res.sendStatus(400);
    } else {
        table.sync().then(() => {
            return table.create(newRecord)
        }).then(() => res.status(200).send('Sucess'))
            .catch(msg => {
                console.log(msg);
                res.sendStatus(500);
            });
    }
});

app.get('/api/delete', (req, res) => {
    var key = req.query.key;
    table.sync().then(() => {
        Drop(table, key).then(() => res.status(200).send('Dropped'))
            .catch(() => res.sendStatus(401));
    });
});

app.get('/ajax/table', (req, res) => {
    table.sync().then(() => {
        AllData(table).then(data => res.json(data)).catch(reason => res.sendStatus(500));
    }).catch((reason) => console.log(reason));
});

app.get('/ajax/chart', (req, res) => {
    const attr = req.query.param, limit = parseInt(req.query.limit);
    table.sync().then(() => {
        Lastest_Records(attr, limit, table).then(data => res.json(data)).catch(reason => res.sendStatus(500));
    }).catch((reason) => console.log(reason));
});

app.listen(port, host, () => {
    console.log(`Listening on  http://${host}:${port}`)
});
