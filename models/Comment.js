const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");


/*
  Comment Schema
*/

const commentSchema = new Schema({
  // 댓글의 내용
  content: { type: String },
  // 댓글이 달린 게시물
  post: { type: Schema.ObjectId, required: true },
  // 댓글 작성자
  user: { type: Schema.ObjectId, required: true, ref: "User" },
}, { 
  // 도큐먼트 생성시간 자동 저장
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})


/*
  가상 필드
*/


// 보여주기용 날짜
commentSchema.virtual("displayDate").get(function () {
  const displayDate = DateTime
    .fromJSDate(this.createdAt)
    .toLocaleString(DateTime.DATETIME_MED);

  return displayDate;
})


// export
module.exports = mongoose.model("Comment", commentSchema);
