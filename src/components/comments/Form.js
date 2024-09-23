import { useState } from "react";

export default function Form({ handleAddComment }) {
    // 댓글 내용
    const [content, setContent] = useState("");

    // 폼 제출 처리
    async function handleSubmit(e) {
        try {
        e.preventDefault();

        // 서버 요청
        await handleAddComment(content);

        // 폼 제출 후 입력란을 비운다
        setContent("");

        } catch (error) {
        alert(error)
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
        <textarea
            rows="2"
            className="border w-full px-2 py-1 rounded resize-none"
            placeholder="댓글 입력..."
            value={content}
            onChange={({ target }) => setContent(target.value)}
        />
        <button
            type="submit"
            className="bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-[0.2]"
            disabled={!content.trim()}
        >
            댓글 달기
        </button>
        </form>
    )
};