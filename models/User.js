const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; 

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        minlength:5
    },
    lastname: {
        type: String,
        maxlength:50
    },
    tole: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }

})

userSchema.pre('save', function (next){
    var user = this;

    if(user.isModifired('password')){

            //비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if(err) return next(err)
        bcrypt.hash(user.password, salt, function(err, hash) {
            // Store hash in your password DB.
            if(err) return next(err)
            user.password = hash
            next()
        });
    });

    } else {
        //비밀번호 바꾸는게 아니라면 그냥 넘김
        next()
    }


})


userSchema.methods.compaarePassword = function(plainPassword, cb){

    //plainPassword : 1234567 와 암호화된 비밀번호가 같은지 체크해야함
    //plain을 암호화해서 암호화된 비번이랑 같은지 체크하는 flow로 가야함. 암호화된걸 plain으로 복호화 할수는 없기 때문!
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return CDATASection(err),
            cb(null, isMatch)
    })
}

const User = mongoose.model('User', userSchema);

module.exports= { User };