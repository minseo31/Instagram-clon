import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
// 서버 요청 처리
import { updateProfile, updateAvatar } from "../service/user";
import AuthContext from "./auth/AuthContext";

export default function ProfileEdit() {
    // 로그인 중인 유저의 데이터
    const { user, setUser } = useContext(AuthContext);
    // 새 이름
    const [newName, setNewName] = useState(user.name);
    // 새 자기소개
    const [newBio, setNewBio] = useState(user.bio);
    // 정보 수정이 발생하지 않은 경우
    const disabled = user.name === newName && user.bio === newBio;

    // 키 스테이트 확인
    console.log(user);

    // 폼 제출처리 
    async function handleSubmit(e) {
        try {
        e.preventDefault();
        
        const editedProfile = { 
            name: newName, 
            bio: newBio 
        };
        
        const { user } = await updateProfile(editedProfile);
        
        setUser(user);

        alert("수정되었습니다");

        } catch (error) {
        alert(error);
        }
    };

    // 파일 (프로필 사진) 처리
    async function handleFile(file) {
        if (file) {
        try {
            const formData = new FormData();

            formData.append("avatar", file);

            // 프로필 사진 수정 요청
            const { user } = await updateAvatar(formData);

            setUser(user);

            // 메시지
            alert("수정되었습니다");
            
        } catch (error) {
            alert(error)
        }
        }
    };

    // 제목 업데이트
    useEffect(() => {
        document.title = "프로필 수정 - Instagram";
    }, [])

    return (
        <div className="px-4">
        <h3 className="my-4 text-lg font-semibold">프로필 수정</h3>

        {/* 사진 업데이트 폼 */}
        <div className="flex mb-4">
            <img
            src={user.avatarUrl}
            className="w-16 h-16 object-cover rounded-full border"
            />

            <div className="grow ml-4">
            <h3>{user.username}</h3>
            <label className="text-sm font-semibold text-blue-500 cursor-pointer">
                <input
                type="file"
                className="hidden"
                onChange={({ target }) => handleFile(target.files[0])}
                // 클라이언트측 파일 포멧 필터링
                accept="image/png, image/jpg, image/jpeg, image/webp"
                />
                사진 업로드
            </label>
            </div>
        </div>

        {/* 정보 폼 */}
        <form onSubmit={handleSubmit}>
            {/* 새 이름 입력란 */}
            <div className="mb-2">
            <label htmlFor="name" className="block font-semibold">이름</label>
            <input
                type="text"
                id="name"
                name="name"
                className="border px-2 py-1 rounded w-full"
                value={newName}
                onChange={({ target }) => setNewName(target.value)}
            />
            </div>

            {/* 자기소개 입력란 */}
            <div className="mb-2">
            <label htmlFor="bio" className="block font-semibold">소개</label>
            <textarea
                id="bio"
                rows="3"
                name="bio"
                className="border px-2 py-1 rounded w-full resize-none"
                value={newBio}
                onChange={({ target }) => setNewBio(target.value)}
            />
            </div>

            {/* 저장 / 취소 버튼 */}
            <div className="flex">
            <button
                type="submit"
                className="text-sm font-semibold bg-blue-500 text-white rounded-lg px-4 py-2 disabled:opacity-[0.2]"
                disabled={disabled}
            >
                저장
            </button>

            <Link
                to={`/profiles/${user.username}`}
                className="ml-2  px-4 py-2 text-sm font-semibold bg-gray-200 rounded-lg"
            >
                취소
            </Link>
            </div>
        </form>
        </div>
    )
};