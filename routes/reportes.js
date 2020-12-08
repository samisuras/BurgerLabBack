const router = require('express').Router()
const reporteCtrl = require('../controllers/reportes')

router.get('/venta/:fecha',reporteCtrl.reporteVenta)

module.exports = router