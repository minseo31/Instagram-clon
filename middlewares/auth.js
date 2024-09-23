const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");
const passport = require("passport");
require("dotenv").config();


// 토큰 처리 전략에 사용되는 옵션
const opts = {};
// 토큰 추출과 관련된 옵션 - 요청의 auth header에서 토큰을 추출한다
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// 토큰 생성에 사용된 키
opts.secretOrKey = process.env.SECRET;


// 토큰 처리전략 생성
const jwtStrategy = new JwtStrategy(opts, async (payload, done) => {
  try {
    // payload에 저장된 정보를 가지고 유저를 검색한다
    const user = await User.findById(payload.sub);
    // Collection.findById(id): id를 가지고 컬렉션을 검색한다

    // 인증 실패 - 401(인증실패) 에러를 던진다
    if (!user) {
      return done(null, false);
    }
    
    // 인증 성공
    return done(null, user);

  } catch (err) {
    return done(err, false);
  }
})


// 토큰 처리전략 적용
passport.use(jwtStrategy);


// 모듈 export
module.exports = passport.authenticate("jwt", { session: false });