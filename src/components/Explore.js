import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// 서버 요청 처리
import { getProfiles } from "../service/profile";
import { FaCircleNotch } from "react-icons/fa6";

export default function Explore() {
    // 에러 처리
    const [error, setError] = useState(null);
    // 대기상태 관리
    const [isLoaded, setIsLoaded] = useState(true);
    // 프로필 저장
    const [profiles, setProfiles] = useState([]);
    const inputRef = useRef(null);

    // 키 스테이트 확인
    console.log(profiles);

    useEffect(() => {
        document.title = "검색 - Instagram";

        inputRef.current.focus();
    }, []);

    // 검색 처리
    async function search(username) {
        try {
        // 검색어가 없는 경우
        if (!username) {
            return setProfiles([]);
        }

        // 에러, 대기상태 초기화
        setError(null);
        setIsLoaded(false);

        // 프로필 가져오기 요청
        const { profiles } = await getProfiles(username);

        // profiles 업데이트
        setProfiles(profiles);

        } catch (error) {
        setError(error)
        } finally {
        setIsLoaded(true);
        }
    };

    // 프로필 리스트 렌더링 처리
    const profileList = profiles.map(profile => (
        <li key={profile.id} className="flex justify-between mb-2">
        <Link to={`/profiles/${profile.username}`} className="flex">
            <img
            src={profile.avatarUrl}
            className="w-10 h-10 object-cover rounded-full border"
            />
            <div className="ml-2">
            <h3 className="block font-semibold">
                {profile.username}
            </h3>
            <span className="block text-gray-400 text-sm">
                {profile.name}
            </span>
            </div>
        </Link>

        {/* 팔로잉 상태 표시 */}
        {profile.isFollowing && (
            <span className="flex items-center text-sm text-blue-500 font-semibold">
            팔로잉
            </span>
        )}
        </li>
    ))

    return (
        <div className="px-4">
        <h3 className="text-lg font-semibold my-4">검색</h3>

        {/* 검색창 */}
        <div className="mb-4">
            <input
            type="text"
            className="border px-2 py-1 rounded w-full outline-none"
            onChange={({ target }) => search(target.value)}
            ref={inputRef}
            />
        </div>

        {/* 검색 결과 */}
        {isLoaded ? (
            <ul>
            {profileList}
            </ul>
        ) : (
            <div className="flex justify-center my-4">
            <FaCircleNotch
                size="32"
                className="animate-spin fill-blue-400"
            />
            </div>
        )}

        {/* 에러메시지 */}
        {error && (
            <p className="text-red-500">{error.message}</p>
        )}
        </div>
    )
};