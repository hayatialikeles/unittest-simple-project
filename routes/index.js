var express = require('express');
var router = express.Router();


const model =require('../models/index')

/* GET home page. */
router.get('/sum', function(req, res, next) {
  new model().sum(req,res);
});
router.get('/minus', function(req, res, next) {
  new model().minus(req,res);
});
router.get('/impact', function(req, res, next) {
  new model().impact(req,res);
});
router.get('/divide', function(req, res, next) {
  new model().divide(req,res);
});


module.exports = router;
