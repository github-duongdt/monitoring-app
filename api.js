const { Sequelize, DataTypes } = require('sequelize');
const db = require('./db-keys.json')

const sequelize = new Sequelize(db.dbname, db.username, db.password, {
    host: db.host,
    dialect: 'mysql',
    timezone: '+07:00',
    pool: {
        max: 5,
        min: 0,
        idle: 10e3,
        acquire: 10e3,
    }
});

const Data = sequelize.define('Data', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    temperature: { type: DataTypes.FLOAT(8, 4), defaultValue: null },
    humidity: { type: DataTypes.FLOAT(8, 4), defaultValue: null },
    illuminance: { type: DataTypes.FLOAT(10, 4), defaultValue: null },
    ghi: { type: DataTypes.FLOAT(8, 4), defaultValue: null },
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'TimeStamp',
    updatedAt: false,
});

const Test = sequelize.define('Test', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    temperature: { type: DataTypes.FLOAT(8, 4), defaultValue: null },
    humidity: { type: DataTypes.FLOAT(8, 4), defaultValue: null },
    illuminance: { type: DataTypes.FLOAT(10, 4), defaultValue: null },
    ghi: { type: DataTypes.FLOAT(8, 4), defaultValue: null },
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'TimeStamp',
    updatedAt: false,
});

var _all_data;
AllData = async (table) => {
    await table.findAll().then((rows) => {
        _all_data = rows.map((item) => {
            newitem = item.dataValues
            newitem.TimeStamp = item.TimeStamp.toLocaleString('vi-VN', { timezone: 'Asia/Ho_Chi_Minh' })
            return newitem
        });
    }).catch(reason => console.log(reason));
    return _all_data
};

var _lastest_records;
Lastest_Records = async (attr, limit, table) => {
    await table.findAll({
        limit: limit,
        attributes: ['TimeStamp', attr],
        order: [['TimeStamp', 'DESC']]
    }).then((rows) => {
        _lastest_records = rows.map((item) => {
            newitem = item.dataValues;
            newitem.TimeStamp = item.TimeStamp;
            return newitem
        });
    }).catch(reason => console.log(reason));
    return _lastest_records
};

DropData = async (table, key) => {
    if (key === db.key) {
        await table.drop();
        return Promise.resolve();
    } else {
        return Promise.reject(new Error('Key not match'));
    }
};

exports.MainTable = Data;
exports.TestTable = Test;
exports.sequelize = sequelize;
exports.AllData = AllData;
exports.Lastest_Records = Lastest_Records;
exports.Drop = DropData;