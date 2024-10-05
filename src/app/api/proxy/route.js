// src/app/api/proxy/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: await req.text(),
            timeout: 130000 // 60 seconds timeout
        });

        if (!response.ok) {
            // Log the error for debugging
            console.error(`External API error! status: ${response.status}`);
            
            // Return a more informative error response
            return NextResponse.json({ 
                error: `External API error`,
                status: response.status,
                statusText: response.statusText
            }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in proxy:', error);
        
        // Return a more detailed error response
        return NextResponse.json({ 
            error: 'Internal Server Error',
            message: error.message
        }, { status: 500 });
    }
}