const router = require('express').Router()
const reporteCtrl = require('../controllers/reportes')

router.get('/venta/:fecha',reporteCtrl.reporteVenta)
router.get('/ingredientes/:fecha',reporteCtrl.reporteIngrediente)

module.exports = router