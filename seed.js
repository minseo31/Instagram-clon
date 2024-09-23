const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const userArgs = process.argv.slice(2);
// 사용자가 명령어에 전달한 DB 주소
const MONGODB_URL = userArgs[0];


// DB주소가 올바르지 않은 경우
if (!MONGODB_URL.startsWith("mongodb")) {
  console.log("Error: You need to specify a valid MongoDB URL.");
  return;
}


seedDatabase();


// 씨드 데이터 생성 처리
async function seedDatabase() {
  try {

    // 데이터 베이스 연결
    await mongoose.connect(MONGODB_URL);

    // 생성할 유저 데이터
    const users = [
      {
        username: "michelangelo",
        name: "Michelangelo",
        avatar: "michelangelo.jpg",
        bio: "나는 대리석 안에서 천사를 보았고 그를 자유롭게 해줄 때까지 조각했다",
      },
      {
        username: "jobs",
        name: "Steve Jobs",
        avatar: "jobs.jpeg",
        bio: "이야 아이폰 많이 좋아졌다",
      },
      {
        username: "dog",
        name: "Mr.Loyal",
        avatar: "dog.jpeg",
        bio: "멍",
      },
    ]


    // 유저 생성
    for (let i = 0; i < users.length; i++) {
      // 모델의 인스턴스 생성
      const user = new User();

      // 필드 값 할당
      user.username = users[i].username;
      user.name = users[i].name;
      user.avatar = users[i].avatar;
      user.bio = users[i].bio;

      // 저장
      await user.save();

      console.log(user);
    }


    // 생성할 게시물 데이터
    const posts = [
      {
        photos: ["david.jpg"],
        caption: "David, Galleria dell'Accademia, Florence"
      },
      {
        photos: ["pieta_1.jpg", "pieta_2.jpg"],
        caption: "Pieta, St. Peter's Basilica, Rome"
      },
      {
        photos: ["bacchus.png"],
        caption: "Bacchus, Museo Nazionale del Bargello, Florence"
      },
      {
        photos: ["angel.jpg"],
        caption: "Angel, Basilica of San Domenico, Bologna"
      },
    ]


    // 미켈란젤로 검색
    const user = await User.findOne({ username: "michelangelo" });


    // 게시물 생성
    for (let i = 0; i < posts.length; i++) {
      const post = new Post();

      post.photos = posts[i].photos
      post.caption = posts[i].caption
      post.user = user._id; // 미켈란젤로의 게시물

      await post.save();

      console.log(post);
    }


    // 완료 메시지
    console.log("Seed database has been completed");


  } catch (error) { // 에러처리
    console.error(error);
  } finally {
    // 데이터베이스 연결 종료
    mongoose.connection.close();
  }
}