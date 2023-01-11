const bcrypt = require("bcrypt");
const env = process.env;


module.exports = class generalMethods {
    constructor() {
        this.authError = "KULLANICI ADI VEYA PAROLA HATALI BİLGİLERİNİZİ KONTROL EDİP  DAHA SONRA TEKRAR DENEYİNİZ !"
        this.tokenError = "HATALI GÜVENLIK KODU LÜTFEN DAHA SONRA TEKRAR DENEYİNİZ !";
        this.errorMessage = "LÜTFEN TÜM ALANLARIN DOĞRULUĞUNU VE FORMATINI KONTROL EDİP  DAHA SONRA TEKRAR DENEYİNİZ !";
        this.Proccessfail = "İŞLEM BAŞARISIZ OLDU LÜTFEN DAHA SONRA TEKRAR DENEYİNİZ !";
        this.failFileUpload = "DOSYA YÜKLEME SIRASINDA BİR HATA OLUŞTU LÜTFEN DAHA SONRA TEKRAR DENEYİNİZ !";
        this.successful = "İŞLEM BAŞARI İLE GERÇEKLEŞTİ";
        this.permErrorMessage = "İŞLEMİ GERÇEKLTİRMEK İÇİN YETERLİ YETKİYE SAHİP DEĞİLSİNİZ"

        // validate error
        this.validatePhoneError = "TELEFON NUMARASI FORMATI HATALI LÜTFEN NUMARAYI KONTROL EDİP TEKRAR DENEYİNİZ !"
        this.validateEmailError = "E-POSTA FORMATINIZ HATALI LÜTFEN E-POSTA ADRESİNİZİ KONTROL EDİP DAHA SONRA TEKRAR DENEYİNİZ !"

        this.successCode = 200;
        this.failCode = 502;
        this.failFileUploadCode = 501;
        this.errorCode = 400;
        this.sessionExpired = 401;

        // password hash sold
        this.hashSold = 15;
    }
    async passwordCompare(password1, password2) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password1, password2).then((result)=>{
                if(result) resolve();
                else reject('Parola Hatalı')
            });
        })

    }
    async passwordHash(password) {
        return new Promise((resolve, reject) => {
            if(password) resolve(bcrypt.hash(password, 12));
            return resolve('');
        })
    }
    async sendPushNotify(title,message,type,deviceId){
        if(deviceId){
            const client = new OneSignal.Client('563f3507-b941-4da0-bf62-465f9f0a987a', 'NDZhMTFmMDgtZGM1Ni00OWU3LWFhYmUtZjBhODIzYmE1YzMx'); 

            const notification = {
                title:{'en':title},
                contents:{'en':message},
                include_player_ids:[deviceId],
                data:{
                    title:title,
                    type:type,
                    message:message
                }
            };
            return client.createNotification(notification);
        }else return new Promise((resolve)=>resolve());
    }
    getTommorrow() {
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        return tomorrow.toISOString().split('T')[0];
    }
    getYesterday() {
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() - 1)
        return tomorrow.toISOString().split('T')[0];
    }
    bufferEncode(data) {
        let buf = Buffer.from(data);
        let base64 = buf.toString('base64');
        return base64
    }
    responseWith(response, state, data, message = null) {
        response.status(state);
        switch (state) {
            case 200:
                response.send({
                    code: this.successCode,
                    data: data,
                    message: message ? message : this.successful,
                });
                break;
            case 502:
                response.send({
                    code: this.failCode,
                    message: message ? message : this.Proccessfail,
                });
                break;
            case 501:
                response.send({
                    code: this.failFileUploadCode,
                    message: message ? message : this.failFileUpload,
                });
                break;
            case 400:
                response.send({
                    code: this.errorCode,
                    message: message ? message : this.errorMessage,
                });
                break;
            case 401:
                response.send({
                    code: 401,
                    message: "OTURUM SÜRENİZ DOLDUĞUNDAN İŞLEM GERÇEKLEŞTİRİLEMEDİ LÜTFEN TEKRAR GİRİŞ YAPINIZ !"
                });
                break;
        }
    }


    getScreetCode() {
        return env.JWT_SCREET_KEY;
    }
    getCustomerScreetCode(){
        return env.JWT_CUSTOMER_SCREET_KEY;
    }
    getPersonelScreetCode(){
        return env.JWT_PERSONEL_SCREET_KEY;
    }
    getFeedbackScreetCode(){
        return env.JWT_FEEDBACK_SCRET_KEY;
    }

    generatePassword() {
            var length = 8,
                charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                retVal = "";
            for (var i = 0, n = charset.length; i < length; ++i) {
                retVal += charset.charAt(Math.floor(Math.random() * n));
            }
            return retVal;
    }
    array_chunk(arr, size) {
        var myArray = [];
        for (var i = 0; i < arr.length; i += size) {
            myArray.push(arr.slice(i, i + size));
        }
        return myArray;
    }
    returnChank(data, page, pageSize = 10) {
        let dataList = data.filter(r => r.id > 0);
        const list = this.array_chunk(dataList, pageSize);
        const cPage = parseInt(page) >= 0 ? page : 0;
        return dataList.length > 0 ? list[cPage] : [];
    }
    Money(value) {
        let val = (value / 1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }

    generalPhoneValidate(val){
        return val.match(/\d/g).length === 10;
    }
    async excelExport(headers,rows){
       return  new Promise((resolve,reject)=>{
            const workbook = new excelJS.Workbook();  // Create a new workbook
            const worksheet = workbook.addWorksheet("shet-1");

            worksheet.columns=headers;

            rows.forEach((el)=>{
                worksheet.addRow(el);
            });
            workbook.xlsx.writeBuffer({
                base64:true
            }).then(file=>{
                resolve(file)
            }).catch(err=>{
                reject(err);
            })
        });

    }
}