const User = require("../models/User");
const { body } = require("express-validator");
const createError = require("http-errors");


/*
  유효성 검사 절차

  1 이메일 검사
  2 비밀번호 검사
*/


module.exports = async (req, res, next) => {
  try {

    // 이메일 검사
    const emailResult = await body("email")
      .isEmail() // 올바른 이메일인지 검사
      .custom(async (email) => { // 존재 여부 검사
        // email - 유저가 로그인 시에 입력한 이메일
        const user = await User.findOne({ email });
        // Collection.findOne(필드): 주어진 필드로 한개의 도큐먼트를 검색한다

        // 존재하지 않는 이메일인 경우
        if (!user) {
          // 401(권한없음) 에러를 던진다
          throw new createError.Unauthorized("E-mail does not exists");
        }
      })
      .run(req);
      
    // 에러 처리
    if (!emailResult.isEmpty()) {
      throw new createError.Unauthorized(emailResult.errors);
    }

    // 비밀번호 검사
    const passwordResult = await body("password")
      .trim() // 불필요한 공백 제거
      .notEmpty() // 값이 없는지 검사
      // 비밀번호 일치 검사
      .custom(async (password, { req }) => {
        // 사용자가 로그인 시에 입력한 이메일
        const email = req.body.email;
        // 이메일로 유저 검색
        const user = await User.findOne({ email });
        
        // 비밀번호 일치 검사
        if (!user.checkPassword(password)) {
          // 401 에러를 던진다
          throw new createError.Unauthorized("Password does not match");
        }
      })
      .run(req)

    // 비밀번호 에러 처리
    if (!passwordResult.isEmpty()) {
      throw new createError.Unauthorized(passwordResult.errors);
    }


    // 다음 미들웨어 호출
    next();

  } catch (error) {
    // 에러 핸들러에게 에러를 전달한다
    next(error)
  }
};