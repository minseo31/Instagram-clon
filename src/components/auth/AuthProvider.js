import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";


export default function AuthProvider({ children }) {
    // 로그인 상태를 유지시킨다
    const initialUser = JSON.parse(localStorage.getItem("authUser"));
    const [user, setUser] = useState(initialUser);

    // 로컬스토리지 동기화
    useEffect(() => {
        if (user) { // 로그인 후
        localStorage.setItem("authUser", JSON.stringify(user));
        } else { // 로그아웃 후
        localStorage.removeItem("authUser");
        }
    }, [user])

    const value = { user, setUser };

    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    )
}