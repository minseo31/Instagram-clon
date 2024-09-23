import { server, getBearerToken } from "./header";


/*
    User 요청

    1 createUser
    유저 생성 요청

    2 signIn
    로그인 요청

    3 updateProfile
    프로필 수정 요청

    4 updateAvatar
    프로필 사진 수정 요청
*/


export async function createUser(newUser) {
    /* 
        fetch(요청URL, 옵션)

        서버 요청을 처리하는 함수.
        결과로 프로미스 객체를 반환한다
    */

    const res = await fetch(`${server}/users`, {
        // 요청 메서드
        method: "POST", 
        // 요청 헤더
        headers: { "Content-Type": "application/json" },
        // 요청 바디
        body: JSON.stringify(newUser)
    })

    // 서버 요청에 실패한 경우 (응답코드가 200이 아닌 경우)
    if (!res.ok) {
        throw new Error(res.statusText + "Error");
    }

    // 요청에 성공한 경우 객체(프로미스)로 변환후 반환한다
    return await res.json();
}


export async function signIn(email, password) {
    const res = await fetch(`${server}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })

    if (!res.ok) {
        throw new Error(res.statusText + "Error")
    }

    return await res.json();
}


export async function updateProfile(editedProfile) {
    const res = await fetch(`${server}/users/user`, {
        method: "PUT",
        headers: { 
        "Content-Type": "application/json",
        // 로그인 토큰
        "Authorization": getBearerToken() 
        },
        body: JSON.stringify(editedProfile)
    })

    if (!res.ok) {
        throw new Error(res.statusText + "Error");
    }

    return await res.json();
}


export async function updateAvatar(formData) {
    const res = await fetch(`${server}/users/user`, {
        method: "PUT",
        headers: { 
        "Authorization": getBearerToken() 
        },
        // 파일을 전송하기 때문에 formData 형식
        body: formData
    })

    if (!res.ok) {
        throw new Error(res.statusText + "Error");
    }

    return await res.json();
}