const multer = require("multer");
const path = require("path"); // 경로 / 확장자 관련 기능 제공
const createError = require("http-errors");
const opts = {}


/*
  파일 핸들러

  1 저장공간 설정
  2 필터 옵션
  3 제한 옵션
*/


// 저장공간 설정
opts.storage = multer.diskStorage({
  // 파일의 저장 경로 - 파일 서버에 저장한다
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../files/${file.fieldname}/`);
  },

  // 파일 이름 생성
  filename: (req, file, cb) => {
    // 확장자
    const extname = path.extname(file.originalname);
    // 랜덤 이름 생성
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)

    cb(null, uniqueSuffix + extname);
  }
})


// 필터 옵션
opts.fileFilter = (req, file, cb) => {
  // 확장자
  const extname = path.extname(file.originalname);
  let isError = false;

  // 파일의 형식 검사
  switch (extname) {
    case ".jpg":
    case ".jpeg":
    case ".png":
    case ".webp":
      break;
    default:
      isError = true;
  }

  // 파일의 형식이 잘못된 경우
  if (isError) {
    // 400 에러 처리
    const err = new createError.BadRequest("Unacceptable type of file");
    
    return cb(err);
  }

  cb(null, true);
}


// 제한 옵션
opts.limits = { fileSize: 1e7 }; // 10MB 까지 업로드 가능


// export
module.exports = multer(opts)