
//todo : c'est pas au bon endroit
function verifyLoginInput(email: string, password: string, username? :string): { error: string } | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if( username ) {
        if ( username.length < 3 || username.length > 30 ) {
            return { "error": "Username must be between 3 and 30 characters" };
        }
    }
    if ( email == "" || password == "" || email == null || password == null ) {
        return { "error": "Email and password are required" };
    } else if (!emailRegex.test(email)) {
        return { "error": "Invalid email format" };
    }
    if (password.length < 12) {
        return { "error": "Password must be at least 12 characters" };
    }
    if (!/[a-z]/.test(password)) {
        return { "error": "Password must contain at least one lowercase letter" };
    }
    if (!/[A-Z]/.test(password)) {
        return { "error": "Password must contain at least one uppercase letter" };
    }
    if (!/[0-9]/.test(password)) {
        return { "error": "Password must contain at least one number" };
    }
    if (!/[!@#$%^&*]/.test(password)) {
        return { "error": "Password must contain at least one special character (! @ # $ % ^ & *)" };
    }

    return null;
}

export async function login(email: string, password: string) {

    const validationError = verifyLoginInput(email, password);
    if (validationError) {
        return new Response(JSON.stringify(validationError), { status: 401, headers: { "Content-Type": "application/json" } });
    }

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

export async function register(email: string, password: string, username?: string) {

    const validationError = verifyLoginInput(email, password, username);

    if (validationError) {
        return new Response(JSON.stringify(validationError), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    const url = process.env.NEXT_PUBLIC_API_URL

    return await fetch( url + "/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password, username}),
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
