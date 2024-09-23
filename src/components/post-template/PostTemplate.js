import { useState } from "react";
import { Link } from "react-router-dom";
// 캐러셀 (사진)
import Carousel from "./Carousel";
// 더보기 기능
import Modal from "./Modal";
import { FaEllipsis, FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa6";

export default function PostTemplate({
    id, 
    username,
    avatarUrl,
    photoUrls,
    caption,
    liked,
    likesCount,
    commentCount,
    displayDate,
    handleLike, 
    handleUnlike,
    handleDelete, 
    isMaster
    }) {
    // 모달 활성화
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="my-4">
        {/* 게시물 작성자 정보, 더보기 버튼 */}
        <div className="px-2 mb-2 flex justify-between items-center">
            <Link
            to={`/profiles/${username}`}
            className="inline-flex items-center"
            >
            <img
                src={avatarUrl}
                className="w-10 h-10 object-cover border rounded-full"
            />
            <span className="ml-2">
                {username}
            </span>
            </Link>

            {isMaster && (
            <FaEllipsis onClick={() => setModalOpen(true)} />
            )}
        </div>

        {/* 모달 */}
        {modalOpen && (
            <Modal 
            id={id}
            setModalOpen={setModalOpen} 
            handleDelete={handleDelete} 
            />
        )}

        {/* 캐러셀 */}
        <Carousel photoUrls={photoUrls} />

        {/* 좋아요 / 좋아요 취소버튼, 댓글 링크 */}
        <div className="mt-2 px-2 flex">
            {liked ? (
            <FaHeart 
                size="24"
                className="fill-red-500" 
                onClick={() => handleUnlike(id)} 
            />
            ) : (
            <FaRegHeart 
                size="24"
                onClick={() => handleLike(id)} 
            />
            )}

            <Link to={`/p/${id}/comments`} className="ml-2">
            <FaRegComment size="24" />
            </Link>
        </div>

        {/* 좋아요 갯수 */}
        <p className="text-sm mt-2 px-2">좋아요 {likesCount}개</p>

        {/* 사진 캡션 */}
        {caption && (
            <p className="mt-4 px-2">
            <Link to={`/profiles/${username}`} className="font-semibold">
                {username}
            </Link>
            {" "}
            {caption}
            </p>
        )}

        {/* 댓글 링크 */}
        {commentCount > 0 && (
            <p className="mt-2 px-2 text-gray-400 text-sm">
            <Link to={`/p/${id}/comments`}> 
                {commentCount}개의 댓글보기
            </Link>
            </p>
        )}

        <small className="block mt-2 px-2 text-gray-400 text-xs">
            {displayDate}
        </small>
        </div>
    )
};