import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// 서버 요청
import { getComments, createComment, deleteComment } from "../../service/commnet";
// 댓글 폼
import Form from "./Form";
// 각각의 댓글
import Comment from "./Comment";
import { FaCircleNotch } from "react-icons/fa6";

export default function Comments() {
    // 게시물의 id
    const { id } = useParams();
    // 에러 관리
    const [error, setError] = useState(null);
    // 대기상태 관리
    const [isLoaded, setIsLoaded] = useState(false);
    // 댓글 저장
    const [comments, setComments] = useState([]);

    // 키 스테이트 확인
    console.log(comments);

    // 댓글 가져오기 요청
    useEffect(() => {
        fetchData();
    }, [])

    // 댓글 가져오기 요청 처리
    async function fetchData() {
        try {
        // 서버요청
        const data = await getComments(id);

        // comments 업데이트
        setComments(data.comments);

        } catch (error) {
        setError(error)
        } finally {
        setIsLoaded(true)
        }
    }

    // 댓글 추가 처리
    async function handleAddComment(content) {
        // 서버 요청
        const data = await createComment(id, content);

        // comments 업데이트
        const updatedComments = [data.comment, ...comments];
        // data.comment: 새 댓글, comments: 기존의 댓글
        setComments(updatedComments);
    };

    // 댓글 삭제 처리
    async function handleDelete(id) {
        // 댓글 삭제 요청
        await deleteComment(id);
        
        // comments 업데이트
        const remainingComments = comments.filter(comment => comment.id !== id);

        setComments(remainingComments);
    };

    // 댓글 렌더링 처리
    const commentList = comments.map(comment => (
        <Comment
        key={comment.id}
        id={comment.id}
        username={comment.user.username}
        avatarUrl={comment.user.avatarUrl}
        content={comment.content}
        displayDate={comment.displayDate}
        handleDelete={handleDelete}
        />
    ))

    return (
        <div className="px-4">
        <h3 className="text-lg font-semibold my-4">댓글</h3>

        {/* 댓글 폼 */}
        <Form handleAddComment={handleAddComment} />

        {commentList.length > 0 ? (
            <ul>
            {commentList}
            </ul>
        ) : (
            <p className="text-center">댓글이 없습니다</p>
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

        {/* 에러메시지 */}
        {error && (
            <p className="text-red-500">{error.message}</p>
        )}
        </div>
    )
};