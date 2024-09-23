import { server, getBearerToken } from "./header";


/*
    Comment 요청

    1 getComments - 댓글 가져오기
    2 createComment - 댓글 생성 요청
    3 deleteComment - 댓글 삭제 요청
*/


export async function getComments(id) {
    const res = await fetch(`${server}/posts/${id}/comments`, {
        headers: { 
        "Authorization": getBearerToken() 
        }
    });

    if (!res.ok) {
        throw new Error(res.statusText + "Error");
    }

    return await res.json();
}


export async function createComment(id, content) {
    const res = await fetch(`${server}/posts/${id}/comments`, {
        method: "POST",
        headers: {
        "Authorization": getBearerToken(),
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ content })
    })

    if (!res.ok) {
        throw new Error(res.statusText + "Error");
    }

    return await res.json();
}


export async function deleteComment(id) {
    const res = await fetch(`${server}/posts/comments/${id}`, {
        method: "DELETE",
        headers: { 
        "Authorization": getBearerToken() 
        }
    })

    if (!res.ok) {
        throw new Error(res.statusText + "Error");
    }

    return await res.json();
}