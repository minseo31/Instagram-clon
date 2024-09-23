import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
// 서버 요청 처리
import { getFollowers } from "../service/profile";
import { FaCircleNotch } from "react-icons/fa6";

export default function Followers() {
    const { username } = useParams();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [profiles, setProfiles] = useState([]);

    // 키 스테이트 확인
    console.log(profiles)

    // 데이터 가져오기
    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {
        try {
        const data = await getFollowers(username);
        
        setProfiles(data.profiles);

        } catch (error) {
        setError(error);
        } finally {
        setIsLoaded(true) 
        }
    }

    // 프로필 렌더링 
    const followerList = profiles.map(profile => (
        <li className="mb-2">
        <Link
            to={`/profiles/${profile.username}`}
            className="inline-flex items-center"
        >
            <img
            src={profile.avatarUrl}
            className="w-12 h-12 object-cover rounded-full border"
            />
            <div className="ml-2">
            <h3 className="font-semibold">{profile.username}</h3>
            <span className="block text-gray-400 text-sm">
                {profile.name}
            </span>
            </div>
        </Link>
        </li>
    ))  

    return (
        <div className="px-4">
        <h3 className="text-lg my-4 font-semibold">{username}의 팔로워</h3>

        {followerList.length > 0 ? (
            <ul>
            {followerList}
            </ul>
        ) : (
            <p>팔로워가 없습니다</p>
        )}

        {/* 대기상태 표시 */}
        {!isLoaded && (
            <div className="flex justify-center my-4">
            <FaCircleNotch
                size="32"
                className="animate-spin fill-blue-400"
            />
            </div>
        )}

        {/* 에러 메시지 */}
        {error && (
            <p className="text-red-500">{error.message}</p>
        )}
        </div>
    )
};