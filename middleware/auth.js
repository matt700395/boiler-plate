const {  User  } = require('../models/User');

let auth = (req, res, next) => {
    //여기서 인증처리를 할 예정

    //클라이언트 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth;

    //토큰을 복호화한 후 유저를 찾는다
    User.findByToken(token, (err, user) => {
        if(err) throw err;

        if(!user) return res.json({ isAuth: false, error: true})

        req.token = token; //token과 user를 req로 넘겨주면 index에서 사용이 가능하게됨
        req.user = user;
        next(); //여기 next()가 없으면 index.js에서 지정해준 auth라는 미들웨어에 갖혀서 못나옴
    })

    //유저가 있으면 인증 오케이

    //유저가 없으면 인증 No!

};



module.exports = { auth };


