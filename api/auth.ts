
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
    console.log(validationError);
    if (validationError) {
        return new Response(JSON.stringify(validationError), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    return await fetch("http://localhost:3000/api/login", {
        method: "POST",
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

    return await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
    });
}