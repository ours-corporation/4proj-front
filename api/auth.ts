
function verifyLoginInput(email: string, password: string): { error: string } | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log("Verifying login input:", email, password);
    if ( email == "" || password == "" || email == null || password == null ) {
        return { "error": "Email and password are required" };
    } else if (!emailRegex.test(email)) {
        return { "error": "Invalid email format" };
    }
    return null;
}

export async function login(email: string, password: string) {

    const validationError = verifyLoginInput(email, password);
    if (validationError) {
        return new Response(JSON.stringify(validationError), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    const url = process.env.NEXT_PUBLIC_API_URL

    return await fetch( url + "/api/login", {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
    });
}

export async function register(email: string, password: string) {

    const validationError = verifyLoginInput(email, password);

    if (validationError) {
        return new Response(JSON.stringify(validationError), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const url = process.env.NEXT_PUBLIC_API_URL

    return await fetch( url + "/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
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