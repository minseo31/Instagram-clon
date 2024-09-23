const User = require("../models/User");


/*
  유저 컨트롤러

  1 create
  유저 생성 처리

  2 update
  유저 정보 업데이트 처리

  3 login
  로그인 처리
*/


exports.create = async (req, res, next) => {
  try {

    // 클라이언트가 전송한 데이터
    const { email, name, username, password } = req.body;

    // 해당 유저 도큐먼트를 생성한다
    const user = new User();

    user.email = email;
    user.name = name;
    user.username = username;
    user.setPassword(password); // 비밀번호 암호화

    await user.save();

    // 서버의 응답
    res.json({ user });

  } catch (error) {
    next(error)
  }
};

exports.update = async (req, res, next) => {
  try {
    // 로그인 유저
    const _user = req.user;

    // 프로필 사진 수정 요청을 한 경우
    if (req.file) {
      _user.avatar = req.file.filename;
    }

    // 이름 수정 요청을 한 경우
    if ("name" in req.body) {
      _user.name = req.body.name;
    }

    // 자기소개 수정 요청을 한 경우
    if ("bio" in req.body) {
      _user.bio = req.body.bio;
    }

    // 변경사항 저장
    await _user.save();

    // 로그인 토큰 재발급
    const access_token = _user.generateJWT();

    // 유저데이터 선별
    const user = {
      username: _user.username,
      name: _user.name,
      avatarUrl: _user.avatarUrl,
      bio: _user.bio,
      access_token
    }

    // 서버의 응답
    res.json({ user })

  } catch (error) {
    next(error)
  }
};

exports.login = async (req, res, next) => {
  try {

    // 클라이언트가 전송한 이메일
    const { email } = req.body;

    // 해당 이메일로 유저 도큐먼트를 검색한다
    const _user = await User.findOne({ email });

    // 로그인 토큰을 생성한다
    const access_token = _user.generateJWT();

    // 선별된 유저 데이터
    const user = {
      username: _user.username,
      name: _user.name,
      avatarUrl: _user.avatarUrl,
      bio: _user.bio,
      access_token
    }

    // 서버의 응답
    res.json({ user })

  } catch (error) {
    next(error);
  }
};