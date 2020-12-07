const Sequelize = require('sequelize')
const sequelize = require('../util/sequelize')

/*
    idprocedimiento int(11) AI PK 
    nombre varchar(100) 
    precio int(11)
*/


const Procedimiento = sequelize.define('procedimiento', {
    idprocedimiento: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
    },
    clave_1: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    clave_2: {
        type: Sequelize.STRING,
        allowNull: false
    },
    concepto: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    precio: {
        type: Sequelize.DECIMAL,
        allowNull: false,
    }
},{
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'procedimiento'
})

module.exports = Procedimiento