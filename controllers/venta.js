const pool = require('../util/dbConnection')

exports.order = async (req, res) => {
    const {ingredients,correo,total} = req.body
    const createOrder = "INSERT INTO orden (precio) VALUES (?)"
    const createOrderUser = "INSERT INTO orden_usuario (idorden,correo,fecha) VALUES(?,?,?)"
    const createIngredientOrder = "INSERT INTO ingrediente_orden (ingrediente,idorden,cantidad) VALUES(?,?,?)"
    try {
        const [orden] = await pool.query(createOrder, [total])
        await pool.query(createOrderUser,[orden.insertId,correo,new Date().toISOString()])
        if(ingredients.lechuga > 0){
            await pool.query(createIngredientOrder,['lechuga',orden.insertId,ingredients.lechuga])
        }
        if(ingredients.tocino > 0){
            await pool.query(createIngredientOrder,['tocino',orden.insertId,ingredients.tocino])
        }
        if(ingredients.queso > 0){
            await pool.query(createIngredientOrder,['queso',orden.insertId,ingredients.queso])
        }
        if(ingredients.carne > 0){
            await pool.query(createIngredientOrder,['carne',orden.insertId,ingredients.carne])
        }
        res.status(200).json({
            ok: 'ok'
        })
    } catch (error) {
        res.status(400).json({
            error
        })
    }
}

exports.getOrdenes = async(req,res) => {
    const {correo} = req.params
    const getOrdenesSql = "SELECT * FROM orden "+
    "JOIN orden_usuario ou ON ou.idorden = orden.idorden "+
    "JOIN  ingrediente_orden i_o ON i_o.idorden = orden.idorden "+
    "JOIN ingrediente ON ingrediente.nombre = i_o.ingrediente "+ 
    "WHERE ou.correo = ?;"
    try {
        const [ordenes] = await pool.query(getOrdenesSql,[correo])
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