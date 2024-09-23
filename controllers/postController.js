const User = require("../models/User");
const Following = require("../models/Following");
const Post = require("../models/Post");
const Likes = require("../models/Likes");
const createError = require("http-errors");


/*
  Post 컨트롤러

  1 feed - 피드
  2 find - 게시물 여러개 찾기
  3 findOne - 게시물 한개 찾기
  4 create - 게시물 생성
  5 deleteOne - 게시물 삭제
  6 like - 좋아요 처리
  7 unlike - 좋아요 취소 처리
*/


exports.feed = async (req, res, next) => {
  try {
    const followingDocs = await Following.find({ user: req.user._id });

    // 로그인 유저가 팔로우 하는 유저들
    const followings = followingDocs
      .map(followingDoc => followingDoc.following);

    // 검색 조건 - 로그인 유저가 팔로우하는 유저들과 본인
    const where = { user: [...followings, req.user._id] };
    // 클라이언트에 데이터를 전송할 때 한번에 보낼 도큐먼트의 수
    const limit = req.query.limit || 5;
    // 데이터를 전송할 때 건너뛸 도큐먼트의 수
    const skip = req.query.skip || 0;

    // 게시물 검색
    const posts = await Post.find(where)
      .populate({ // 게시물 작성자에 대한 정보
        path: "user",
        select: "username avatar avatarUrl"
      })
      .populate("commentCount") // 댓글 갯수
      .populate({
        path: "liked", // 로그인 유저가 게시물을 좋아요했는지 여부
        match: { user: req.user._id }
      })
      // 생성일 기준 내림차순으로 정렬
      .sort({ createdAt: "desc" })
      .skip(skip)
      .limit(limit)

    // 총 게시물의 갯수
    const postCount = await Post.countDocuments(where);

    // 서버의 응답
    res.json({ posts, postCount });

  } catch (error) {
    next(error);
  }
};

exports.find = async (req, res, next) => {
  try {
    // 검색조건
    const where = {};

    // 조건1 - 타임라인 (특정 유저의 게시물 목록) 검색
    if ("username" in req.query) {
      // 타임라인을 볼 프로필
      const user = await User.findOne({ username: req.query.username });

      // 유저가 없는 경우 404 처리
      if (!user) { 
        throw new createError.NotFound("User is not found");
      }
      
      // 조건 추가
      where.user = user._id;
    }

    // 게시물 검색
    const posts = await Post
      .find(where)
      .populate("commentCount") // 댓글 갯수
      .sort({ createdAt: "desc" }) // 생성일 기준 내림차순 정렬

    // 총 게시물 갯수
    const postCount = await Post.countDocuments(where);

    // 서버의 응답
    res.json({ posts, postCount });

  } catch (error) {
    next(error);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    // 게시물 검색
    const post = await Post.findById(req.params.id)
      .populate({
        path: "user",
        select: "username avatar avatarUrl"
      })
      .populate("commentCount")
      .populate({
        path: "liked",
        match: { user: req.user._id }
      })

    // 게시물이 없는 경우 404 처리
    if (!post) {
      throw new createError.NotFound("Post is not found");
    }

    // 서버의 응답
    res.json({ post });

  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    // 클라이언트가 전송한 이미지
    const files = req.files;

    // 전송한 이미지가 없는 경우
    if (!files || files.length < 1) {
      // 400 에러 처리
      throw new createError.BadRequest("File is required");
    }

    // 도큐먼트 생성
    const photoNames = files.map(file => file.filename);

    const post = new Post({
      photos: photoNames,
      caption: req.body.caption,
      user: req.user._id
    });

    await post.save();

    // 서버의 응답
    res.json({ post });

  } catch (error) {
    next(error);
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    // 삭제할 게시물을 검색한다
    const post = await Post.findById(req.params.id);

    // 게시물이 없는 경우 404 처리
    if (!post) {
      throw new createError.NotFound("Post is not found");
    }

    // 본인 게시물인지 확인
    const isMaster = req.user._id.toString() === post.user.toString();

    // 본인 게시물이 아닌 경우 400 처리
    if (!isMaster) {
      throw new createError.BadRequest("Incorrect User");
    }

    // 삭제
    await post.deleteOne();

    // 서버의 응답
    res.json({ post });

  } catch (error) {
    next(error)
  }
};

exports.like = async (req, res, next) => {
  try {
    // 좋아요 처리할 게시물을 검색한다
    const post = await Post.findById(req.params.id)

    // 게시물이 없는 경우 404 처리
    if (!post) {
      throw new createError.NotFound("Post is not found");
    }

    // 이미 좋아요 한 게시물인지 확인
    const liked = await Likes
      .findOne({ user: req.user._id, post: post._id });

    // 좋아요 한 게시물이 아닌 경우 좋아요 처리
    if (!liked) {
      // Likes 도큐먼트 생성
      const likes = new Likes({
        user: req.user._id,
        post: post._id
      })
      
      await likes.save();

      // 게시물의 좋아요 개수를 1 증가시킨다
      post.likesCount++;
      await post.save();
    }
    
    // 서버의 응답
    res.json({ post })

  } catch (error) {
    next(error)
  }
};

exports.unlike = async (req, res, next) => {
  try {
    // 좋아요 취소할 게시물 검색
    const post = await Post.findById(req.params.id)

    // 게시물이 없는 경우 404 처리
    if (!post) {
      throw new createError.NotFound("Post is not found");
    }

    // 좋아요 한 게시물인지 확인
    const liked = await Likes
      .findOne({ user: req.user._id, post: post._id });

    // 좋아요 한 게시물이 맞는 경우 취소 처리
    if (liked) {
      // 도큐먼트 삭제
      await liked.deleteOne();
  
      // 게시물의 좋아요 갯수를 1 감소시킨다
      post.likesCount--;
      await post.save();
    }

    // 서버 응답
    res.json({ post });

  } catch (error) {
    next(error)
  }
};