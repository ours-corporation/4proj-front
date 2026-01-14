export async function authGoogle(code : string) {

    const url = process.env.NEXT_PUBLIC_API_URL

    return await fetch( url + "/api/auth/google", {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({code}),
    });
}