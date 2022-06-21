const express = require('express')
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { User } = require("./models/User");
const mongoose = require('mongoose');

//application/x-www-form-urlencoded 이런식으로 된 데이터를 가져와서 분석해주는 코드
app.use(bodyParser.urlencoded({ extended: true }));

//application/json 으로된 데이터를 가져와서 분석할수있게 하는 코드
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req, res) =>{
    //회원가입 할때 필요한 정보들을 Clinent 에서 가져오면
    //그것들을 데이터베이스에 넣어준다 

    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {
    console.log('pinga');

    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        console.log('pingb');
        if(!user) {
            console.log('pingc');
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            }) 
        }
    // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
    //User.js에서 comparePassword 메소드를 만들어서 사용하면됨
    console.log('pingk');
    user.comparePassword(req.body.password , (err, isMatch) => {
        console.log('ping0');
        if(!isMatch){
            console.log('pingl');
            return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
        }
        // 비밀번호까지 맞다면 토큰을 생성하기
        user.generateToken((err, user) => {
            //jsonwebtoken을 이용해서 token을 생성하기
            if(err) return res.status(400).send(err);

            //토큰을 저장한다 -> 어디에? 오늘은 쿠키에 저장해보자
            res.cookie('x_auth', user.token).status(200).json({loginSuccess: true, userId: user._id})
        })
    })
    })

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
