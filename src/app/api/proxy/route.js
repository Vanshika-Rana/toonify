// src/app/api/proxy/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    try {
        console.log('Initiating request to external API');
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: await req.text(),
            timeout: 150000 // 2 minutes timeout
        });

        console.log(`Received response from external API. Status: ${response.status}`);

        if (!response.ok) {
            console.error(`External API error! Status: ${response.status}, StatusText: ${response.statusText}`);
            return NextResponse.json({ 
                error: `External API error`,
                status: response.status,
                statusText: response.statusText
            }, { status: response.status });
        }

        const data = await response.json();
        console.log('Successfully processed response from external API');
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in proxy:', error);
        
        return NextResponse.json({ 
            error: 'Internal Server Error',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}