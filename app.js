//dependencias
const express = require('express')
const body_parser = require('body-parser')
const cors = require('cors')

//rutas
const loginRoutes = require('./routes/login')

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

    //iniciamos el server
    app.listen(process.env.PORT || app.get('port'),()=> {
        console.log('server on')
    })
}

main()