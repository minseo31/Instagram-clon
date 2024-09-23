    /* 
    폼데이터 유효성 검사 처리

    1 isEmail
    올바른 이메일인지 검사

    2 isUsername
    올바른 아이디인지 검사

    3 isPassword
    올바른 비밀번호인지 검사
    */

    export function isEmail(email) {
        const patt = /[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/
        
        return patt.test(email);  
    }
    
    export function isUsername(username) {
        const patt = /^[a-zA-Z0-9]{5,}$/
    
        return patt.test(username);
    }
    
    export function isPassword(password) {
        return password.trim().length >= 5;
    }