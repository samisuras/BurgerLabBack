const { forEach } = require('mysql2/lib/constants/charset_encodings')
const pool = require('../util/dbConnection')

exports.reporteVenta = async(req,res) =>{
    const {fecha} = req.params
    const reporteDia = "SELECT * FROM orden "+
    "JOIN orden_usuario ou ON ou.idorden = orden.idorden "+
    "JOIN  ingrediente_orden i_o ON i_o.idorden = orden.idorden "+
    "JOIN ingrediente ON ingrediente.nombre = i_o.ingrediente "+
    "WHERE ou.fecha = ? GROUP BY orden.idorden ;"
    const reporte_anual = "SELECT * FROM orden "+
    "JOIN orden_usuario ou ON ou.idorden = orden.idorden "+
    "JOIN  ingrediente_orden i_o ON i_o.idorden = orden.idorden "+
    "JOIN ingrediente ON ingrediente.nombre = i_o.ingrediente "+
    "WHERE ou.fecha BETWEEN '2020-01-01' AND '2020-12-31' GROUP BY orden.idorden ;"
    const reporte_mes = "SELECT * FROM orden "+
    "JOIN orden_usuario ou ON ou.idorden = orden.idorden "+
    "JOIN  ingrediente_orden i_o ON i_o.idorden = orden.idorden "+
    "JOIN ingrediente ON ingrediente.nombre = i_o.ingrediente "+
    "WHERE ou.fecha BETWEEN '2020-12-01' AND '2020-12-31' GROUP BY orden.idorden ;"
    try {
        const [resultados] = await pool.query(reporteDia,[fecha])
        const [resultados_anual] = await pool.query(reporte_anual)
        const [resultados_mes] = await pool.query(reporte_mes)
        console.log(resultados);
        let venta_dia = 0
        resultados.forEach(resultado => {
            venta_dia += resultado.precio
        })
        let venta_anual = 0
        resultados_anual.forEach(resultado => {
            venta_anual += resultado.precio
        })
        let venta_mensual = 0
        resultados_mes.forEach(resultado => {
            venta_mensual += resultado.precio
        })
        res.status(200).json({
            venta_dia,
            venta_anual,
            venta_mensual
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error
        })
    }
}

exports.reporteIngrediente = async(req,res) => {
    const {fecha} = req.params
    const ingredientesSql = "SELECT SUM(i_o.cantidad) AS total, i_o.ingrediente FROM orden "+
    "JOIN orden_usuario ou ON ou.idorden = orden.idorden "+
    "JOIN  ingrediente_orden i_o ON i_o.idorden = orden.idorden "+ 
    "JOIN ingrediente ON ingrediente.nombre = i_o.ingrediente "+
    "WHERE ou.fecha = ? GROUP BY ingrediente.nombre ORDER BY total; "
    const ingredientesMes = "SELECT SUM(i_o.cantidad) AS total, i_o.ingrediente FROM orden "+
    "JOIN orden_usuario ou ON ou.idorden = orden.idorden "+
    "JOIN  ingrediente_orden i_o ON i_o.idorden = orden.idorden "+ 
    "JOIN ingrediente ON ingrediente.nombre = i_o.ingrediente "+
    "WHERE ou.fecha BETWEEN '2020-01-01' AND '2020-12-31' GROUP BY ingrediente.nombre ORDER BY total; "
    const ingredientesAnual = "SELECT SUM(i_o.cantidad) AS total, i_o.ingrediente FROM orden "+
    "JOIN orden_usuario ou ON ou.idorden = orden.idorden "+
    "JOIN  ingrediente_orden i_o ON i_o.idorden = orden.idorden "+ 
    "JOIN ingrediente ON ingrediente.nombre = i_o.ingrediente "+
    "WHERE ou.fecha BETWEEN '2020-01-01' AND '2020-12-31' GROUP BY ingrediente.nombre ORDER BY total;"
    try{
        const [ingrediente_dia] = await pool.query(ingredientesSql,[fecha])
        const [ingrediente_mes] = await pool.query(ingredientesMes)
        const [ingrediente_anual] = await pool.query(ingredientesAnual)
        res.status(200).json({
            ingrediente_dia,
            ingrediente_mes,
            ingrediente_anual
        })
    }catch(error){
        console.log(error);
    }
}