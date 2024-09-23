const express = require("express")
const router = express.Router();
const auth = require("../middlewares/auth");
const loginValidator = require("../middlewares/loginValidator");
const signUpValidator = require("../middlewares/signUpValidator");
const upload = require("../middlewares/upload");
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const profileController = require("../controllers/profileController");


/*
  라우터

  1 구조
  router.requestMethod(요청URL, 미들웨어, 컨트롤러)

  2 라우터 종류
  1) User 라우터
  2) Post 라우터
  3) Comment 라우터
  4) Profile 라우터
*/


// 인덱스 페이지
// 유저가 GET 요청 메서드로 인덱스 페이지(/)를 요청한 경우
router.get("/", (req, res) => { // req(request): 요청 객체, res(response): 응답 객체
  // 서버의 응답 - 클라이언트에게 메시지를 전송한다
  res.json({ message: "Hello Client!" });
})


// User 라우터
router.post("/users", signUpValidator, userController.create);
router.post("/users/login", loginValidator, userController.login);
router.put("/users/user", auth, upload.single("avatar"), userController.update);


// Post 라우터
router.get("/posts/feed", auth, postController.feed)
router.get("/posts", auth, postController.find)
router.post("/posts", auth, upload.array("photos", 10), postController.create)
router.get("/posts/:id", auth, postController.findOne)
router.delete("/posts/:id", auth, postController.deleteOne)
router.post("/posts/:id/like", auth, postController.like)
router.delete("/posts/:id/unlike", auth, postController.unlike)


// Comment 라우터
router.get("/posts/:id/comments", auth, commentController.find)
router.post("/posts/:id/comments", auth, commentController.create)
router.delete("/posts/comments/:id", auth, commentController.deleteOne)


// Profile 라우터
router.get("/profiles", auth, profileController.find);
router.get("/profiles/:username", auth, profileController.findOne)
router.post("/profiles/:username/follow", auth, profileController.follow)
router.delete("/profiles/:username/unfollow", auth, profileController.unfollow)


// export
module.exports = router;