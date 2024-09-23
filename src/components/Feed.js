import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom";
// 서버요청 처리
import { getFeed, deletePost, likePost, unlikePost } from "../service/post";
import AuthContext from "./auth/AuthContext";
// 보여지는 부분 처리
import PostTemplate from "./post-template/PostTemplate";
import { FaCircleNotch } from "react-icons/fa6";

export default function Feed() {
    const { user } = useContext(AuthContext)
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    // 게시물 저장
    const [posts, setPosts] = useState([]);
    // 전체 피드 게시물의 갯수
    const [postCount, setPostCount] = useState(0);
    // 더보기 기능 구현에 필요
    const [skip, setSkip] = useState(0);
    const limit = 5;

    // 키 스테이트 확인
    console.log(posts);

    // 데이터 요청
    useEffect(() => {
        fetchData();
    }, [skip]) // skip - 더보기 기능

    // 데이터 가져오는 함수
    async function fetchData() {
        try {
        setError(null);
        setIsLoaded(false);

        // 서버 요청
        const data = await getFeed(limit, skip);

        // posts 업데이트
        const updatedPosts = [...posts, ...data.posts];
        
        setPosts(updatedPosts);
        setPostCount(data.postCount);

        } catch (error) {
        setError(error);
        } finally {
        setIsLoaded(true)
        }
    }

    // 좋아요 처리
    async function handleLike(id) {
        try {
        await likePost(id);

        const updatedPosts = posts.map(post => {
            if (post.id === id) {
            return {
                ...post,
                liked: true,
                likesCount: post.likesCount + 1
            }
            }
            return post;
        })
    
        setPosts(updatedPosts);

        } catch (error) {
        alert(error)
        }
    };

    // 좋아요 취소 처리
    async function handleUnlike(id) {
        try {
        await unlikePost(id)

        const updatedPosts = posts.map(post => {
            if (post.id === id) {
            return {
                ...post,
                liked: false,
                likesCount: post.likesCount - 1
            }
            }
            return post;
        })
    
        setPosts(updatedPosts);

        } catch (error) {
        alert(error)
        }
    };

    // 게시물 삭제 처리
    async function handleDelete(id) {
        try {
        await deletePost(id); 

        const remainingPosts = posts.filter(post => {
            if (id !== post.id) {
            return post;
            }
        });
    
        setPosts(remainingPosts);
        
        } catch (error) {
        alert(error)
        }
    };

    // 게시물 렌더링
    const postList = posts.map(post => (
        <PostTemplate
        key={post.id}
        id={post.id}
        username={post.user.username}
        avatarUrl={post.user.avatarUrl}
        photoUrls={post.photoUrls}
        caption={post.caption}
        liked={post.liked}
        likesCount={post.likesCount}
        commentCount={post.commentCount}
        displayDate={post.displayDate}
        handleLike={handleLike}
        handleUnlike={handleUnlike}
        handleDelete={handleDelete}
        isMaster={user.username === post.user.username}
        />
    ))

    return (
        <>
        {postList.length > 0 ? (
            <ul>
            {postList}
            </ul>
        ) : (
            // 피드 게시물이 없을 때 검색 페이지로 안내 
            <div className="mt-12 h-[500px] flex justify-center items-center border border-black">
                <Link to="/explore">
                <span className="text-2xl">검색</span>
                <img className="inline-block w-24 ml-2" src="/logo.png" />
                </Link>
            </div>
        )}

        {/* 더보기 버튼 */}
        {postCount > posts.length && ( // 더 가져올 게시물이 있을 경우
            <button
            className="w-full p-2 text-blue-500 font-semibold"
            onClick={() => setSkip(skip + limit)}
            >
            더보기
            </button>
        )}

        {/* 대기 상태 표시 */}
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
        </>
    )
};