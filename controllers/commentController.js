const Post = require("../models/Post");
const Comment = require("../models/Comment");
const createError = require("http-errors");


/*
  Comment 컨트롤러

  1 find - 댓글 가져오기
  2 create - 댓글 생성
  3 deleteOne - 댓글 삭제
*/


exports.find = async (req, res, next) => {
  try {
    // 댓글을 가져올 게시물 검색
    const post = await Post.findById(req.params.id);

    // 게시물이 없는 경우 404 처리
    if (!post) {
      throw new createError.NotFound("Post is not found");
    }

    // 댓글 검색 조건
    const where = { post: post._id };

    // 검색
    const comments = await Comment
      .find(where)
      .populate({
        path: "user",
        select: "username avatar avatarUrl"
      })
      .sort({ createdAt: "desc" })

    // 댓글 갯수
    const commentCount = await Comment.countDocuments(where);
    
    // 서버 응답
    res.json({ comments, commentCount });

  } catch (error) {
    next(error)
  }
};

exports.create = async (req, res, next) => {
  try {
    // 댓글을 달 게시물을 검색한다
    const post = await Post.findById(req.params.id);

    // 게시물이 없는 경우 404 처리
    if (!post) {
      throw new createError.NotFound("Post is not found");
    }

    // 댓글 생성
    const comment = new Comment({
      content: req.body.content, // 댓글의 내용
      post: post._id, // 댓글 단 게시물
      user: req.user._id // 댓글 작성자
    })

    await comment.save();

    // 댓글 작성자 정보 조인
    await comment.populate({
      path: "user",
      select: "username avatar avatarUrl"
    })

    // 서버의 응답
    res.json({ comment });

  } catch (error) {
    next(error)
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    // 삭제할 댓글 검색
    const comment = await Comment.findById(req.params.id);

    // 댓글이 없는 경우 404 처리
    if (!comment) {
      throw new createError.NotFound("Comment is not found");
    }

    // 본인 댓글인지 확인
    const isMaster = req.user._id.toString() === comment.user.toString();

    // 본인 댓글이 아닌 경우 400 처리
    if (!isMaster) {
      throw new createError.BadRequest("Incorrect user");
    }

    // 댓글 삭제
    await comment.deleteOne();

    // 서버 응답
    res.json({ comment });

  } catch (error) {
    next(error)
  }
};