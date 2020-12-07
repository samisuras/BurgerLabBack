const Sequelize = require('sequelize')
const sequelize = require('../util/sequelize')
const Model = Sequelize.Model

/*
    idusuario int(11) AI PK 
    idrol int(11) 
    contrasena varchar(45) 
    nombre varchar(45) 
    apellidoP varchar(45) 
    apellidoM varchar(45)
*/


const Usuario = sequelize.define('usuario', {
    idusuario: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
    },
    idrol: {
        type: Sequelize.INTEGER
    },
    contrasena: {
        type: Sequelize.STRING
    },
    nombre: {
        type: Sequelize.STRING
    },
    apellidoP: {
        type: Sequelize.STRING
    },
    apellidoM: {
        type: Sequelize.STRING
    }
},{
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'usuario'
})

module.exports = Usuario