import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
// 서버 요청 처리
import { getPost, deletePost, likePost, unlikePost } from "../service/post";
import AuthContext from "./auth/AuthContext";
// 보여지는 부분 처리
import PostTemplate from "./post-template/PostTemplate";
import { FaCircleNotch } from "react-icons/fa6";

export default function PostView() {
    // 게시물의 id
    const { id } = useParams();
    // 게시물 저장
    const [post, setPost] = useState(null);
    const navigate = useNavigate();
    // 로그인 유저
    const { user } = useContext(AuthContext);

    // 키 스테이트 확인
    console.log(post);

    // 데이터 요청
    useEffect(() => {
        fetchData();
    }, []);

    // 데이터 요청 처리
    async function fetchData() {
        try {
        // 게시물 가져오기 요청
        const data = await getPost(id);

        // post 업데이트
        setPost(data.post);

        } catch (error) {
        navigate("/notfound", { replace: true });
        }
    }

    // 좋아요 처리
    async function handleLike(id) {
        try {
        // 서버 요청
        await likePost(id)

        // post 업데이트
        const updatedPost = {
            ...post,
            liked: true,
            likesCount: post.likesCount + 1
        }

        setPost(updatedPost);

        } catch (error) {
        alert(error)
        }
    };

    // 좋아요 취소 처리
    async function handleUnlike(id) {
        try {

        await unlikePost(id);

        const updatedPost = {
            ...post,
            liked: false,
            likesCount: post.likesCount - 1
        }

        setPost(updatedPost);
        
        } catch (error) {
        alert(error)
        }
    }

    // 게시물 삭제 처리
    async function handleDelete(id) {
        try {
        // 삭제 요청
        await deletePost(id);
        
        // 피드로 이동
        navigate("/", { replace: true });
        
        } catch (error) {
        alert(error)
        }
    };

    // 대기상태 표시
    if (!post) {
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
        <PostTemplate
        id={post.id}
        username={post.user.username}
        avatarUrl={post.user.avatarUrl}
        photoUrls={post.photoUrls}
        caption={post.caption}
        likesCount={post.likesCount}
        commentCount={post.commentCount}
        displayDate={post.displayDate}
        liked={post.liked}
        handleLike={handleLike}
        handleUnlike={handleUnlike}
        handleDelete={handleDelete}
        // 본인 게시물인지 확인
        isMaster={user.username === post.user.username}
        />
    )
};