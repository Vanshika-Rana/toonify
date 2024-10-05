// src/app/api/proxy/route.js
export async function POST(req) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Ensure this environment variable is set correctly

    try {
        const response = await fetch(apiUrl, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: await req.text(), // Forward the body from the client
        });

        // Check if the response from the external API is okay
        if (!response.ok) {
            throw new Error(`External API error! status: ${response.status}`);
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: response.status });
    } catch (error) {
        console.error('Error in proxy:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
