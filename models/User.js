// 몽고 DB를 Node.js환경에서 사용할 수 있도록 라이브러리를 호출하여 데이터베이스 사용
const mongoose = require("mongoose")
// 몽고 DB 라이브러리의 스키마 객체를 호출하여 스키마 생성 가능
const Schema = mongoose.Schema;
// JWT라이브러리를 호출하여 웹 토큰 사용을 할 수 있음
const jwt = require("jsonwebtoken");
// 암호화 기능을 수행하는 여러 메서드를 내장한 모듈 호출
const crypto = require("crypto");                      // crypto: 암호화 기능 내장 패키지  (해시 값 변환 , 복호화 , 비밀번호 해싱 등)
// Post 모델 호출 (유저의 게시물)
const Post = require("./Post");
// Following 모델 호출 (유저의 팔로잉 목록)
const Following = require("./Following");


/* 
  User Schema
*/


const userSchema = new Schema({
  // 이메일 - 문자열로 최소 5글자
  email: { type: String, minLength: 5 },
  // 비밀번호 - 문자열로 최소 5글자
  password: { type: String, minLength: 5 },
  // 비밀번호 암호화에 사용되는 키 - 문자열
  salt: { type: String },
  // 아이디 - 문자열로 최소 3글자와 무조건 값(입력)이 존재해야함
  username: { type: String, minLength: 3, required: true },
  // 이름 - 문자열
  name: { type: String },
  // 프로필 사진 - 문자열로 기본값으로 해당 png 사진을 가짐
  avatar: { type: String, default: "default.png" },
  // 자기 소개 - 문자열
  bio: { type: String }
}, { // 옵션 
  // 가상필드는 DB에 포함되지 않아 가상필드의 연산 값이 JSON으로 변환할 떄 응답처리에서 제외되기에 해당 코드를 통해 가상필드를 JSON변환 과정에서 포함시켜 응답처리할 수 있도록 정의
  toJSON: { virtuals: true },
  // 가상필드를 js객체로 변환하여 처리하며 이를 통하여 요청에 대한 가상필드의 동작을 처리 하며 이를 false로 바꾸면 가상필드는 제외되어 처리된다
  toObject: { virtuals: true }
}); 


/*
  가상 필드 (Virtual field)

  컬렉션 조인을 통해 가상 필드를 생성한다
  가상 필드는 데이터를 풍부하게 만든다
  가상 필드는 데이터베이스 상에서는 존재하지 않는다
*/


// 프로필 사진 주소 - 클라이언트가 파일에 쉽게 접근할 수 있다
// avatarUrl이라는 가상필드를 생성하고 현재 요청 값을 읽어온다
userSchema.virtual("avatarUrl").get(function () {
  // 현재 환경변수 files/avatar/경로에 현재 유저 스키마의 avatar 값인 파일명이 반환된다
  return process.env.FILE_URL + "/avatar/" + this.avatar;
})

// 유저의 게시물 갯수
// postCount라는 가상필드를 생성함 두 번째 인수로 조인, 고유 키 정의로 필터링,  post의 갯수 를 탐색한다
userSchema.virtual("postCount", {
  ref: "Post", // Post 컬렉션과 조인 
  localField: "_id", // 기본키 - 조인의 기준 , 현재 자신(유저)스키마의 식별자를 탐색
  foreignField: "user", // 외래키 - 조인의 기준, 외부의 다른 스키마를 식별자를 통해 탐색
  count: true  // 현재 user가 가진 post의 갯수를 셈 
})

// 팔로워 수
userSchema.virtual("followerCount", {
  ref: "Following", // 조인
  localField: "_id",
  foreignField: "following",
  count: true
})

// 팔로잉 수
userSchema.virtual("followingCount", {
  ref: "Following",
  localField: "_id",
  foreignField: "user",
  count: true
})

// 팔로우 여부
userSchema.virtual("isFollowing", {
  ref: "Following",
  localField: "_id",
  foreignField: "following",
  justOne: true
})


/*
  Operation

  모델이 자신의 데이터를 처리하기 위한 행위
*/


// 비밀번호 암호화
// 현재 스키마에 비밀번호 생성에 대한 메서드를 생성 (메서드의 매개변수로 사용자가 입력한 비밀번호값을 전달)
userSchema.methods.setPassword = function (password) {
  // 비밀번호 암호화에 사용되는 키 (비밀번호에 대한 해시 값으로 암호화 향상)
  this.salt = crypto                    // 현재의 스키마에 임의의 암호화 데이터 공간에 crypt암호동작을 통하여 비밀번호를 할당
    .randomBytes(16).toString("hex");   // 비밀번호는 16바이트 크기의 데이터를 생성하고 16진수 문자열로 변환함
  
  // 비밀번호 암호화 (실질적인 비밀번호가 저장되는 값)
  this.password = crypto                                      // crypto 모듈로 비밀번호에 암호화를 생성
    // 비밀번호를 해싱하며 이때 해싱의 결과값은 (해싱할 값, 암호화할 해시 값, 해싱 알고리즘 시간, 해시값의 길이, 해시값의 길이와 동작)
    .pbkdf2Sync(password, this.salt, 310000, 32, "sha256")   
    .toString("hex")                                          // 16진수 문자열로 변환
}


// 비밀번호 검사 처리
// 현재 스키마에 비밀번호 검사에 대한 메서드를 생성 (메서드의 매개변수로 사용자가 입력한 비밀번호의 값을 전달)
userSchema.methods.checkPassword = function (password) {
  // 유저가 현재 입력한 암호화된 비밀번호 값을 나타냄  
  const hashedPassword = crypto
    .pbkdf2Sync(password, this.salt, 310000, 32, "sha256")
    .toString("hex")
  
  // this.password - 유저가 가입할 때 입력한 암호화된 비밀번호
  // hashedPassword - 유저가 로그인 할때 입력한 암호화된 비밀번호
  return this.password === hashedPassword;                      // 현재 입력한 유저의 비밀번호와 기존의 유저의 비밀번호를 비교
}

// 로그인 토큰 생성
userSchema.methods.generateJWT = function () {
  // 토큰에 저장되는 유저의 정보
  const payload = { 
    // 유저의 데이터에 대한 고유 식별값
    sub: this._id, 
    // 유저의 데이터 중  유저 이름
    username: this.username 
  }

  // 토큰 생성에 사용되는 키 (환경변수에 정의한 키)
  const secret = process.env.SECRET;

  // 토큰 생성
  return jwt.sign(payload, secret);
}


// 모델 export
module.exports = mongoose.model("User", userSchema);