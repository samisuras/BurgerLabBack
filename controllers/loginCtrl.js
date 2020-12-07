const pool = require('../util/dbConnection')

exports.login = async (req, res) => {
    const { correo, contrasena } = req.body
    const sql = "SELECT * FROM usuario WHERE correo = ? AND contrasena = ?;"

    try {
        //Obtenemos el id del usuario decoded.id
        const [usuario] = await pool.execute(sql, [correo, contrasena])
        if(usuario.length > 0){
            res.status(200).json({
                usuario: usuario[0]
            })
        }else{
            res.status(400).send({
                error: "Contraseñan y/o usuario incorrecto"
            });
        }
    } catch (error) {
        console.log(error);

        res.status(400).send({
            error: error
        });
    }
}

exports.register = async (req, res) => {
    const { correo, nombre, apellido, contrasena, contrasena2 } = req.body
    const createUserSql = "INSERT INTO usuario (nombre,apellido,correo,contrasena) VALUES (?,?,?,?)"
    try {
        await pool.query(createUserSql, [nombre, apellido, correo, contrasena])
        res.status(200).json({
            ok: 'ok'
        })
    } catch (error) {
        res.status(400).json({
            error
        })
    }

}