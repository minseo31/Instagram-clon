const User = require("../models/User");
const Following = require("../models/Following");
const createError = require("http-errors");


/*
  Profile 컨트롤러

  1 find - 프로필 찾기
  2 findOne - 프로필 한개 찾기
  3 follow - 팔로우 처리
  4 unfollow - 언팔로우 처리
*/


exports.find = async (req, res, next) => {
  try {
    // 검색 조건
    const where = {};

    // 조건1 - 특정 유저가 팔로우하는 프로필 목록
    if ("following" in req.query) {
      // req.query: 클라이언트가 서버에 전송한 작은 데이터

      // 특정 유저를 검색한다
      const user = await User
        .findOne({ username: req.query.following });

      // 유저가 존재하지 않는 경우 404 에러를 던진다
      if (!user) {
        throw new createError.NotFound("Profile is not found");
      }

      // 조건 추가
      const followingDocs = await Following
        .find({ user: user._id })

      const followings = followingDocs
        .map(followingDoc => followingDoc.following);

      where._id = followings;
    }


    // 조건2 - 특정 유저의 팔로워 목록
    if ("followers" in req.query) {
      // 특정 유저 검색
      const user = await User
        .findOne({ username: req.query.followers });

      // 유저가 존재하지 않는 경우 404 처리
      if (!user) {
        throw new createError.NotFound("Profile is not found");
      }

      // 조건 추가
      const followerDocs = await Following
        .find({ following: user._id })

      const followers = followerDocs.map(followerDoc => followerDoc.user);

      where._id = followers;
    }

    // 특정 글자(아이디)를 포함하는 프로필 목록 - 프로필 검색
    if ("username" in req.query) {     
      // 정규식(Regular Expression) 활용 
      where.username = new RegExp(req.query.username, "i");
    }


    // 도큐먼트에서 추출할 필드를 정한다
    const profileFields = "username name avatar avatarUrl bio";

    // 프로필 검색
    const profiles = await User
      // find(검색 조건, 검색 필드) - 조건에 해당하는 도큐먼트를 여러개 검색한다
      .find(where, profileFields)
      .populate({ // 조인 실행
        path: "isFollowing", // 로그인 유저의 프로필 팔로우 여부
        match: { user: req.user._id }
      })

    // 프로필 갯수 구하기
    const profileCount = await User.countDocuments(where);

    // 서버의 응답
    res.json({ profiles, profileCount });

  } catch (error) {
    next(error)
  }
};

exports.findOne = async (req, res, next) => {
  try {
    // 도큐먼트에서 추출할 필드
    const profileFields = "username name avatar avatarUrl bio";

    // 프로필 검색
    const profile = await User
      // req.params - URL 매개변수 
      .findOne({ username: req.params.username }, profileFields)
      .populate("postCount")
      .populate("followerCount")
      .populate("followingCount")
      .populate({
        path: "isFollowing",
        match: { user: req.user._id }
      })

    // 프로필이 없는 경우 404 처리
    if (!profile) {
      throw new createError.NotFound("Profile is not found");
    }

    // 서버의 응답
    res.json({ profile });

  } catch (error) {
    next(error)
  }
};

exports.follow = async (req, res, next) => {
  try {
    // 도큐먼트에서 추출할 필드
    const profileFields = "username name avatar avatarUrl bio";

    // 팔로우 할 프로필 검색
    const profile = await User
      .findOne({ username: req.params.username }, profileFields)

    // 프로필이 없는 경우 404 처리
    if (!profile) {
      throw new createError.NotFound("Profile is not found");
    }

    // 자기 자신을 팔로우 요청한 경우 400 에러 처리
    if (req.user.username === req.params.username) {
      throw new createError.BadRequest("Cannot follow yourself");
    }

    // 이미 팔로우 중인 경우
    const isFollowing = await Following
      .findOne({ user: req.user._id, following: profile._id });

    // 팔로우 중이 아닌 경우 팔로우 처리
    if (!isFollowing) {
      // Following 도큐먼트를 생성한다
      const following = new Following({
        user: req.user._id,
        following: profile._id
      })
  
      await following.save();
    }
    
    // 서버의 응답
    res.json({ profile });

  } catch (error) {
    next(error);
  }
};

exports.unfollow = async (req, res, next) => {
  try {
    // 도큐먼트에서 추출할 필드
    const profileFields = "username name avatar avatarUrl bio";

    // 언팔할 프로필을 검색한다
    const profile = await User
      .findOne({ username: req.params.username }, profileFields)

    // 프로필이 없는 경우 404 처리
    if (!profile) {
      throw new createError.NotFound("Profile is not found");
    }

    // 팔로우 중이 맞는지 확인한다
    const isFollowing = await Following
      .findOne({ user: req.user._id, following: profile._id });

    // 팔로우 중이 맞는 경우 언팔 처리
    if (isFollowing) {  
      // 해당 도큐먼트를 삭제한다
      await isFollowing.deleteOne();
    }

    // 서버의 응답
    res.json({ profile });

  } catch (error) {
    next(error);
  }
};