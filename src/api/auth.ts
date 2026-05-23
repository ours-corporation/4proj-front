export async function login(email: string, password: string) {

    const url = process.env.NEXT_PUBLIC_API_URL

    return await fetch(url + "/api/login", {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
    });
}

export async function register(email: string, password: string, username?: string, terms_accepted?: boolean) {

    const url = process.env.NEXT_PUBLIC_API_URL

    return await fetch( url + "/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password, username, terms_accepted}),
    });
}

export async function testToken(accesToken: string) : Promise<boolean> {
    const url = process.env.NEXT_PUBLIC_API_URL

    const rep = await fetch( url + "/api/users/me", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accesToken}`,
        },
    });

    return rep.status === 200;
}

export async function refreshToken()  : Promise<Response> {
    const url = process.env.NEXT_PUBLIC_API_URL

    return await fetch(url + '/api/refresh', {
        method: 'POST',
        credentials: 'include'
    });
}

export async function logout(){

    const url = process.env.NEXT_PUBLIC_API_URL

    return await fetch( url + "/api/logout", {
        method: "POST",
        credentials: 'include',
    });
}

export async function verifyEmail(token: string) {
    const url = process.env.NEXT_PUBLIC_API_URL

    return await fetch(url + `/api/verify-email?token=${encodeURIComponent(token)}`, {
        method: "GET",
    });
}

export async function forgotPassword(email: string) {
    const url = process.env.NEXT_PUBLIC_API_URL

    return await fetch(url + "/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
}

export async function resetPassword(token: string, password: string) {
    const url = process.env.NEXT_PUBLIC_API_URL

    return await fetch(url + "/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
    });
}

export async function acceptTerms(accessToken: string) {
    const url = process.env.NEXT_PUBLIC_API_URL

    return await fetch(url + "/api/accept-terms", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
    });
}

export async function resendVerification(email: string) {
    const url = process.env.NEXT_PUBLIC_API_URL

    return await fetch(url + "/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
}
