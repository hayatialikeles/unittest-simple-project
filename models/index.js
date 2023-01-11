const generalMethods=require('../tools/generalMethods')

module.exports=class example extends generalMethods{

    sum(req,res){
        const {number1,number2} =req.query;
        this.responseWith(res,this.successCode,Number(number1)+Number(number2));
    }
    minus(req,res){
        const {number1,number2} =req.query;
        this.responseWith(res,this.successCode,Number(number1)-Number(number2));
    }
    impact(req,res){
        const {number1,number2} =req.query;
        this.responseWith(res,this.successCode,Number(number1)*Number(number2));
    }
    divide(req,res){
        const {number1,number2} =req.query;
        this.responseWith(res,this.successCode,Number(number1)/Number(number2));
    }
}