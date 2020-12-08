const router = require('express').Router()
const ventaCtrl = require('../controllers/venta')

router.post('/orden',ventaCtrl.order)
router.get('/ordenes/:correo',ventaCtrl.getOrdenes)

module.exports = router