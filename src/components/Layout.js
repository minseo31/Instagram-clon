import { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import AuthContext from "./auth/AuthContext";
import { FaInstagram, FaRegCompass } from "react-icons/fa6";

export default function Layout() {
    const { user } = useContext(AuthContext);

    return (
        <>
        <header className="fixed top-0 left-0 w-full border-b z-10 bg-white">
            <div className="max-w-sm mx-auto px-2 h-10 flex justify-between items-center">
            {/* 로고 */}
            <img className="w-24" src="/logo.png" />

            {/* 메뉴 */}
            <ul className="flex items-center">
                <li>
                <Link to="/" className="block">
                    <FaInstagram size="28" />
                </Link>
                </li>
                <li className="ml-2">
                <Link to="/explore" className="block">
                    <FaRegCompass size="24" />
                </Link>
                </li>
                <li className="ml-2">
                <Link to={`/profiles/${user.username}`}>
                    <img
                    src={user.avatarUrl}
                    className="w-8 h-8 object-cover border rounded-full"
                    />
                </Link>
                </li>
            </ul>
            </div>
        </header>

        {/* 메인 */}
        <main className="max-w-sm mx-auto pt-10">
            {/* Layout 라우트의 자식 라우트의 엘리먼트가 렌더링 되는 곳 */}
            <Outlet />
        </main>
        </>
    )
};