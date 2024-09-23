import { useState } from "react";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";

export default function Carousel({ photoUrls }) {
    const [photoIndex, setPhotoIndex] = useState(0);
    const isFirstPhoto = photoIndex === 0;
    const isLastPhoto = photoIndex === photoUrls.length - 1;

    // 사진 
    const photoList = photoUrls.map(photoUrl => (
        <img
        key={photoUrl}
        src={photoUrl}
        className="w-full h-full flex-none object-cover"
        alt={photoUrl}
        />
    ))

    // 인디케이터의 점
    const dots = photoUrls.map((photoUrl, dotIndex) => (
        <li
        key={photoUrl}
        className="w-2 h-2 rounded-full bg-white opacity-50"
        style={{ opacity: (dotIndex === photoIndex) && "1" }}
        >
        </li>
    ))

    return (
        <div className="w-full h-[450px] overflow-x-hidden relative">
        {/* 사진 */}
        <ul
            className="w-full h-full flex transition"
            style={{ transform: `translateX(-${photoIndex * 100}%)`}}
        >
            {photoList}
        </ul>

        {/* 이전 버튼 */}
        {!isFirstPhoto && (
            <div className="absolute top-0 left-4 h-full flex items-center">
            <FaCircleChevronLeft
                size="18" 
                className="fill-white/80"
                onClick={() => setPhotoIndex(photoIndex - 1)}
            />
            </div>
        )}

        {/* 다음 버튼 */}
        {!isLastPhoto && (
            <div className="absolute top-0 right-4 h-full flex items-center">
            <FaCircleChevronRight
                size="18" 
                className="fill-white/80"
                onClick={() => setPhotoIndex(photoIndex + 1)}
            />
            </div>
        )}

        {/* 인디케이터 */}
        {photoUrls.length > 1 && (
            <ul className="absolute bottom-4 w-full flex justify-center gap-2">
            {dots}
            </ul>
        )}
        </div>
    )
};