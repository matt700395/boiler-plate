const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const { JsonWebTokenError } = require('jsonwebtoken');
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

    if (user.isModified('password')){

        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if(err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash) {
                // Store hash in your password DB.
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });

    } else {
        //비밀번호 바꾸는게 아니라면 그냥 넘김
        next()
    }
})


userSchema.methods.comparePassword = function(plainPassword, cb){
    //plainPassword : 1234567 와 암호화된 비밀번호가 같은지 체크해야함
    //plain을 암호화해서 암호화된 비번이랑 같은지 체크하는 flow로 가야함. 암호화된걸 plain으로 복호화 할수는 없기 때문!
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){

        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function (cb) {
    var user = this;

    //jsonwebtoken을 이용해서 token생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken'); //user._id랑 secretToken 두개를 더해서 token을 만들고, 나중에 secretToken 를 가지고 user._id를 찾는것
    //user._id가 Hex인데 sign을 받을때 plain으로 받는걸로 옵션 셋팅을 해둬서 string으로 바꿔서 넣어줘야함

     user.token = token;
     user.save(function (err, user) {
        if(err) return cb(err);
        cb(null, user); //여기서 callback함수를 받은 user정보가 index의 user.generateToken의 user로 감
     })
}

const User = mongoose.model('User', userSchema);

module.exports= { User };