const User = require("../models/User");
const { body } = require("express-validator");
const createError = require("http-errors");


/*
  가입폼 유효성 검사

  1 이메일 검사
  2 아이디 검사
  3 비밀번호 검사
*/


module.exports = async (req, res, next) => {
  try {

    // 이메일
    const emailResult = await body("email")
      .isEmail() // 이메일 형식 검사
      // 이메일 중복 검사
      .custom(async (email) => {
        // 유저가 입력한 이메일로 User 컬렉션을 검색한다
        const user = await User.findOne({ email });
        
        // 사용중인 이메일인 경우 에러 처리
        if (user) {
          throw new Error("E-mail is already in use");
        }
      })
      .run(req);

    // 이메일 에러를 에러 핸들러에게 전달한다
    if (!emailResult.isEmpty()) {
      throw new createError.BadRequest(emailResult.errors);
    }


    // 유저네임 검사
    const usernameResult = await body("username")
      .trim() // 불필요한 공백 제거
      .isLength({ min: 5 }) // 길이 검사
      .isAlphanumeric() // 문자 또는 숫자만 가능
      // 중복검사
      .custom(async (username) => {
        // 사용자가 입력한 username으로 User컬렉션 검색
        const user = await User.findOne({ username });
      
        // 사용중인 유저네임인 경우 에러 처리
        if (user) {
          throw new Error("Username is already in use");
        }
      })
      .run(req);

    
    // 에러 핸들러에게 유저네임 에러를 전달한다
    if (!usernameResult.isEmpty()) {
      throw new createError.BadRequest(usernameResult.errors);
    }


    // 비밀번호 검사
    const passwordError = await body("password")
      .trim()
      .isLength({ min: 5 })
      .run(req);

    if (!passwordError.isEmpty()) {
      throw new createError.BadRequest(passwordError.errors);
    }


    // 다음 미들웨어 호출
    next();


  } catch (error) {
    next(error)
  }
}