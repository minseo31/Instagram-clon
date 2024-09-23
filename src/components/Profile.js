import { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import AuthContext from "./auth/AuthContext";
// 프로필 관련 서버 요청 처리
import { getProfile, getTimeline, follow, unfollow } from "../service/profile";
import { FaCircleNotch, FaArrowRightFromBracket, FaHeart, FaComment } from "react-icons/fa6";

export default function Profile() {
    // username 매개변수
    const { username } = useParams();
    // value 객체
    const { user, setUser } = useContext(AuthContext);
    // 프로필 
    const [profile, setProfile] = useState(null);
    // 게시물 
    const [posts, setPosts] = useState([]);
    // 로그인 유저가 본인 프로필 페이지를 방문한 경우 참이 된다
    const isMaster = user.username === profile?.username;
    // profile?.username - profile이 null이 아닐 때 username에 접근한다
    const navigate = useNavigate();

    // 키 스테이트 추적
    console.log(profile, posts);

    // 제목 업데이트, 데이터 요청
    useEffect(() => {
        // 데이터 요청
        fetchData();

        document.title = `${username} - Instagram`;
    }, [username]); // username - 다른 프로필로 이동하는 경우

    // 프로필 가져오기 요청 처리
    async function fetchData() {
        try {
        setProfile(null);

        // 서버 요청 - 프로필 데이터, 타임라인
        const profileData = await getProfile(username);
        const timelineData = await getTimeline(username);

        // 변수 업데이트
        setProfile(profileData.profile)
        setPosts(timelineData.posts);

        } catch {
        // 요청에 실패한 경우 404 페이지로 이동시킨다
        navigate("/notfound", { replace: true });
        }
    }

    // 팔로우 처리
    async function handleFollow() {
        try {
        await follow(username)

        setProfile({ ...profile, isFollowing: true })

        } catch (error) {
        alert(error)
        }
    };

    // 언팔로우 처리
    async function handleUnfollow() {
        try {
        await unfollow(username)

        setProfile({ ...profile, isFollowing: false });

        } catch (error) {
        alert(error)
        }
    };

    // 로그아웃 처리
    function handleSignOut() {
        const confirmed = window.confirm("로그아웃하시겠습니까?");

        if (confirmed) {
        setUser(null);
        }
    };

    // 타임라인 렌더링
    const timeline = posts.map(post => (
        <li>
        <Link to={`/p/${post.id}`} className="block h-40 relative">
            {/* 썸네일 */}
            <img
            src={post.photoUrls[0]}
            className="w-full h-full object-cover"
            />

            {/* 썸네일에 호버했을 때 나타나는 오버레이 */}
            <div className="absolute inset-0 bg-black/[0.2] flex flex-col justify-center opacity-0 hover:opacity-100">
            <div className="flex justify-center">
                <FaHeart className="fill-white" size="20" />
                <span className="ml-2 text-white">{post.likesCount}</span>
            </div>
            <div className="flex justify-center">
                <FaComment className="fill-white" size="20" />
                <span className="ml-2 text-white">{post.commentCount}</span>
            </div>
            </div>
        </Link>
        </li>
    ))

    // 프로필을 가져오는 중일 때
    if (!profile) {
        return (
        <div className="flex justify-center my-4">
            <FaCircleNotch
            size="32"
            className="animate-spin fill-blue-400"
            />
        </div>
        )
    }

    return (
        <div className="mt-8">
        {/* 프로필 사진, 프로필 정보 */}
        <div className="flex px-4">
            <img
            src={profile.avatarUrl}
            className="w-20 h-20 object-cover border rounded-full"
            />

            <ul className="ml-2 grow grid grid-cols-3">
            <li className="flex flex-col justify-center items-center">
                <span className="font-semibold">{profile.postCount}</span>
                <span>게시물</span>
            </li>
            <li className="flex flex-col justify-center items-center">
                <Link
                to={`/profiles/${username}/followers`}
                className="font-semibold"
                >
                {profile.followerCount}
                </Link>
                <span>팔로워</span>
            </li>
            <li className="flex flex-col justify-center items-center">
                <Link
                to={`/profiles/${username}/following`}
                className="font-semibold"
                >
                {profile.followingCount}
                </Link>
                <span>팔로잉</span>
            </li>
            </ul>
        </div>

        {/* 이름 & 자기소개 */}
        <div className="mt-4 px-4">
            {profile.name && (
            <h3 className="font-semibold mb-2">
                {profile.name}
            </h3>
            )}

            {profile.bio && (
            <p className="mb-2 whitespace-pre-line text-sm">
                {profile.bio}
            </p>
            )}
        </div>

        {/* 계정 관련 버튼들 */}
        {isMaster && (
            <div className="mt-8 flex px-4">
            <div className="grow grid grid-cols-2 gap-2">
                <Link
                to="/create"
                className="bg-gray-200 rounded-lg px-4 py-2 text-sm text-center font-semibold"
                >
                게시물 업로드
                </Link>
                <Link
                to="/accounts/edit"
                className="bg-gray-200 rounded-lg px-4 py-2 text-sm text-center font-semibold"
                >
                프로필 수정
                </Link>
            </div>
            <button
                className="ml-2 px-4 py-2 text-sm bg-gray-200 font-semibold rounded-lg"
                onClick={handleSignOut}
            >
                <FaArrowRightFromBracket />
            </button>
            </div>
        )}

        {/* 팔로우 / 언팔로우 버튼 */}
        {!isMaster && (
            <div className="mt-8 grid grid-cols-2 gap-2 px-4">
            {profile.isFollowing ? (
                <button
                className="bg-gray-200 text-sm px-4 py-2 font-semibold p-2 rounded-lg"
                onClick={handleUnfollow}
                >
                팔로잉
                </button>
            ) : (
                <button
                className="bg-blue-500 text-white text-sm px-4 py-2 font-semibold p-2 rounded-lg"
                onClick={handleFollow}
                >
                팔로우
                </button>
            )}
            <button className="bg-gray-200 text-sm px-4 py-2 font-semibold p-2 rounded-lg">
                메시지
            </button>
            </div>
        )}

        {/* 타임라인 */}
        {timeline.length > 0 ? (
            <ul className="mt-8 grid grid-cols-3 gap-1">
            {timeline}
            </ul>
        ) : (
            <p className="mt-8 text-center">게시물이 없습니다</p>
        )}
        </div>
    )
};