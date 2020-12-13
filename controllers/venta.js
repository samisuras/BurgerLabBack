const pool = require('../util/dbConnection')

exports.order = async (req, res) => {
    const { ingredients, correo, total } = req.body
    const createOrder = "INSERT INTO orden (precio) VALUES (?)"
    const createOrderUser = "INSERT INTO orden_usuario (idorden,correo,fecha) VALUES(?,?,?)"
    const createIngredientOrder = "INSERT INTO ingrediente_orden (ingrediente,idorden,cantidad) VALUES(?,?,?)"
    const SibApiV3Sdk = require('sib-api-v3-sdk');
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];


    apiKey.apiKey = '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';

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = "Orden Recibidia";
    sendSmtpEmail.htmlContent = `<html>
    <body>
    <h1>Tu orden de tu hamburguesa ha sido recibida</h1>
    <p>Tu hamburguesa contiene los siguientes ingredientes: </p>
    <ul>
    ${ingredients}
    </ul>
    <p>Total: ${total}</p>
    </body>
    </html>`;
    sendSmtpEmail.sender = { "name": "Burger Lab", "email": "orden@burgerlab.com" };
    sendSmtpEmail.to = [{ "email": correo, "name": "Estimado Cliente" }];
    sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
    sendSmtpEmail.params = { "subject": "Nueva Orden" };
    try {
        apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
            console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        }, function (error) {
            console.error(error);
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            error
        })
    }

    try {
        const [orden] = await pool.query(createOrder, [total])
        await pool.query(createOrderUser, [orden.insertId, correo, new Date().toISOString().split('T')[0]])
        if (ingredients.lechuga > 0) {
            await pool.query(createIngredientOrder, ['lechuga', orden.insertId, ingredients.lechuga])
        }
        if (ingredients.tocino > 0) {
            await pool.query(createIngredientOrder, ['tocino', orden.insertId, ingredients.tocino])
        }
        if (ingredients.queso > 0) {
            await pool.query(createIngredientOrder, ['queso', orden.insertId, ingredients.queso])
        }
        if (ingredients.carne > 0) {
            await pool.query(createIngredientOrder, ['carne', orden.insertId, ingredients.carne])
        }
        res.status(200).json({
            ok: 'ok'
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error
        })
    }
}

exports.getOrdenes = async (req, res) => {
    const { correo } = req.params
    const getOrdenesSql = "SELECT * FROM orden " +
        "JOIN orden_usuario ou ON ou.idorden = orden.idorden " +
        "JOIN  ingrediente_orden i_o ON i_o.idorden = orden.idorden " +
        "JOIN ingrediente ON ingrediente.nombre = i_o.ingrediente " +
        "WHERE ou.correo = ?;"
    try {
        const [respuesta] = await pool.query(getOrdenesSql, [correo])
        /*const ordenObj = {
            "idorden": 3,
            "precio": 25,
            "correo": "samisuraspop0@hotmail.com",
            "fecha": "2020-12-07T22:55:21.078Z",
            "ingrediente": "lechuga",
            "cantidad": 1,
            "nombre": "lechuga",
            "costo": 5
        }*/
        const ordenes = []

        let idordenA = 0;
        let cont = 0
        for (let i = 0; i < respuesta.length; i++) {
            const orden = respuesta[i];
            if (idordenA != orden.idorden) {
                if(i!=0){
                    cont++
                }
                idordenA = orden.idorden
                ordenes.push({
                    idorden: orden.idorden,
                    precio: orden.precio,
                    correo: orden.correo,
                    fecha: orden.fecha,
                    ingrediente: [orden.ingrediente,],
                    cantidad: [orden.cantidad,],
                    nombre: orden.nombre,
                    costo: orden.costo
                })
            } else {
                console.log("object");
                console.log(orden);
                ordenes[cont].ingrediente.push(orden.ingrediente)
                ordenes[cont].cantidad.push(orden.cantidad)
            }
        }
        res.status(200).json({
            ordenes
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error
        })
    }
}

exports.getOrdenesDia = async (req, res) => {
    const getOrdenesSql = "SELECT * FROM orden " +
        "JOIN orden_usuario ou ON ou.idorden = orden.idorden " +
        "JOIN  ingrediente_orden i_o ON i_o.idorden = orden.idorden " +
        "JOIN ingrediente ON ingrediente.nombre = i_o.ingrediente " +
        "WHERE ou.fecha = ? ORDER BY ou.idorden DESC;"
    try {
        const dia = new Date().toISOString().split('T')[0]
        console.log(dia);
        const [respuesta] = await pool.query(getOrdenesSql, [dia])
        /*const ordenObj = {
            "idorden": 3,
            "precio": 25,
            "correo": "samisuraspop0@hotmail.com",
            "fecha": "2020-12-07T22:55:21.078Z",
            "ingrediente": "lechuga",
            "cantidad": 1,
            "nombre": "lechuga",
            "costo": 5
        }*/
        const ordenes = []

        let idordenA = 0;
        let cont = 0
        for (let i = 0; i < respuesta.length; i++) {
            const orden = respuesta[i];
            if (idordenA != orden.idorden) {
                if(i!=0){
                    cont++
                }
                idordenA = orden.idorden
                ordenes.push({
                    idorden: orden.idorden,
                    precio: orden.precio,
                    correo: orden.correo,
                    fecha: orden.fecha,
                    ingrediente: [orden.ingrediente,],
                    cantidad: [orden.cantidad,],
                    nombre: orden.nombre,
                    costo: orden.costo
                })
            } else {
                console.log("object");
                console.log(orden);
                ordenes[cont].ingrediente.push(orden.ingrediente)
                ordenes[cont].cantidad.push(orden.cantidad)
            }
        }
        res.status(200).json({
            ordenes
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error
        })
    }
}