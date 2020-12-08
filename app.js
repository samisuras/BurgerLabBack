//dependencias
const express = require('express')
const body_parser = require('body-parser')
const cors = require('cors')

//rutas
const loginRoutes = require('./routes/login')
const ordenRoutes = require('./routes/venta')
const reportesRoutes = require('./routes/reportes')

async function main(){
    //servidor
    const app = express()
    //puertp
    app.set('port',3300)

    //Middleware
    app.use(body_parser.json())
    app.use(cors())
    body_parser.urlencoded({extended: true})

    //rutas
    app.use('/user',loginRoutes)
    app.use('/venta',ordenRoutes)
    app.use('/reportes',reportesRoutes)
    //iniciamos el server
    app.listen(process.env.PORT || app.get('port'),()=> {
        console.log('server on')
    })
}

main()