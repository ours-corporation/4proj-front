export async function authGithub(code: string, redirectUri: string) {

    const url = process.env.NEXT_PUBLIC_API_URL

    return await fetch( url + "/api/auth/github", {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, redirect_uri: redirectUri }),
    });
}