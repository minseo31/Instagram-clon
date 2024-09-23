const mongoose = require("mongoose")
const Schema = mongoose.Schema;


// Following - 팔로우 관계 데이터 


// Schema
const followingSchema = new Schema({
  // 팔로우 한 유저
  user: { type: Schema.ObjectId, required: true },
  // 팔로우 받은 유저
  following: { type: Schema.ObjectId, required: true }
}, { 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})


module.exports = mongoose.model("Following", followingSchema);