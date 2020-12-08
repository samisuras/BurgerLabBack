const pool = require('../util/dbConnection')

exports.order = async (req, res) => {
    const { ingredients, correo, total } = req.body
    const createOrder = "INSERT INTO orden (precio) VALUES (?)"
    const createOrderUser = "INSERT INTO orden_usuario (idorden,correo,fecha) VALUES(?,?,?)"
    const createIngredientOrder = "INSERT INTO ingrediente_orden (ingrediente,idorden,cantidad) VALUES(?,?,?)"
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
        console.log(respuesta);
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
                cont = i
                idordenA = orden.idorden
                ordenes.push({
                    idorden: orden.idorden,
                    precio: orden.precio,
                    correo: orden.correo,
                    fecha: orden.fecha,
                    ingrediente: [orden.ingrediente],
                    cantidad: [orden.cantidad],
                    nombre: orden.nombre,
                    costo: orden.costo
                })
            } else {
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