const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('nodeDB', 'root', 'mysql020820', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+07:00'
});

const Data = sequelize.define('Data', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    temperature: { type: DataTypes.FLOAT(8, 4), defaultValue: null },
    ghi: { type: DataTypes.FLOAT(8, 4), defaultValue: null },
    voltage: { type: DataTypes.FLOAT(8, 4), defaultValue: null },
    current: { type: DataTypes.FLOAT(8, 4), defaultValue: null },
    power: { type: DataTypes.FLOAT(8, 4), defaultValue: null }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'TimeStamp',
    updatedAt: false,
});

var _all_data;
AllData = async () => {
    await Data.findAll().then((rows) => {
        _all_data = rows.map((item) => {
            newitem = item.dataValues
            newitem.TimeStamp = item.TimeStamp.toLocaleString('vi-VN', { timezone: 'Asia/Ho_Chi_Minh' })
            return newitem
        });
    }).catch(reason => console.log(reason));
    return _all_data
};

var _lastest_records;
Lastest_Records = async (attr, limit) => {
    await Data.findAll({
        limit: limit,
        attributes: ['TimeStamp', attr],
        order: [['TimeStamp', 'DESC']]
    }).then((rows) => {
        _lastest_records = rows.map((item) => {
            newitem = item.dataValues
            newitem.TimeStamp = item.TimeStamp.toLocaleString({ timezone: 'Asia/Ho_Chi_Minh' })
            return newitem
        });
    }).catch(reason => console.log(reason));
    return _lastest_records
};

exports.mytable = Data
exports.sequelize = sequelize
exports.AllData = AllData
exports.Lastest_Records = Lastest_Records 