// 몽고DB 라이브러리를 호출
const mongoose = require("mongoose")
// 몽고DB 라이브러리에 존재하는 스키마 메서드를 호출
const Schema = mongoose.Schema;
// 날짜와 시간을 다루는 라이브러리를 객체 타입으로 호출
const { DateTime } = require("luxon");
// Comment 모델을 호출
const Comment = require("./Comment");
//  likes 모델을 호출
const Likes = require("./Likes");


/*
  Post Schema
*/

const postSchema = new Schema({
  // 사진 - 문자열로 항상 값이 존재해야함
  photos: [{ type: String, required: true }],
  // 사진에 대한 설명 - 문자열
  caption: { type: String },
  // 게시물 작성자 ref - User컬렉션과 조인한다 - 객체형태로 항상 값이 존재하며 User파일 조인하여 데이터를 공유
  user: { type: Schema.ObjectId, required: true, ref: "User" },
  // 좋아요 수 - 숫자로 기본 값은 항상 0으로 시작
  likesCount: { type: Number, default: 0 },
}, { // 옵션 
  // 도큐먼트의 생성시간 자동 저장
  timestamps: true,             // createAt, updatedAt를 자동으로 추가하게 하며 이는 각각의 문서의 생성과 수정 시간을 나타낸다 
  toJSON: { virtuals: true },   // 문서가 평가될때 데이터베이스상 존재하지 않는 가상필드를 평가하도록 함 
  toObject: { virtuals: true }  // 문서가 평가될떄 가상필드를 js로 평가하도록 정의
})


/*
  가상 필드
*/


// 보여주기용 날짜
// displayDate라는 가상필드를 생성하고 
postSchema.virtual("displayDate").get(function () {
  const displayDate = DateTime
    .fromJSDate(this.createdAt) // createdAt - 타임스탬프
    .toLocaleString(DateTime.DATE_MED);

  return displayDate;
})


// 게시물 사진 URL 생성 - 클라이언트의 접근에 도움
postSchema.virtual("photoUrls").get(function () {
  const urls = this.photos.map(photoName => {
    return process.env.FILE_URL + "/photos/" + photoName
  })

  return urls;
})


// 댓글 갯수 
postSchema.virtual("commentCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  count: true
})

// 사용자의 게시물 좋아요 여부
postSchema.virtual("liked", {
  ref: "Likes",
  localField: "_id", 
  foreignField: "post",
  justOne: true
})


// 모델 export
module.exports = mongoose.model("Post", postSchema);