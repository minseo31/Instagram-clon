// 공통 모듈 (여러 모듈에서 호출되는 모듈)

// 1 서버 주소
export const server = "http://localhost:3000/api";

// 2 토큰 추출 함수
export function getBearerToken() {
    // 로컬스토리지에서 JWT를 가져온다
    const user = JSON.parse(localStorage.getItem("authUser"));
    
    return "Bearer " + user.access_token;
}