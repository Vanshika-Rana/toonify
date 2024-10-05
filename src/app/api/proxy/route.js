// src/app/api/proxy/route.js
import { NextResponse } from 'next/server';

const jobStatus = new Map();

export async function POST(req) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const body = await req.json();
    const jobId = Date.now().toString();

    jobStatus.set(jobId, { status: 'pending', startTime: Date.now() });

    // Start the job in the background
    processJob(jobId, apiUrl, body);

    return NextResponse.json({ jobId }, { status: 202 });
}

async function processJob(jobId, apiUrl, body) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`External API error! status: ${response.status}`);
        }

        const data = await response.json();
        jobStatus.set(jobId, { status: 'completed', data });
    } catch (error) {
        console.error('Error in job processing:', error);
        jobStatus.set(jobId, { status: 'error', error: error.message });
    }
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId || !jobStatus.has(jobId)) {
        return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 });
    }

    const job = jobStatus.get(jobId);
    
    // Clean up old jobs
    const now = Date.now();
    for (const [id, status] of jobStatus.entries()) {
        if (now - status.startTime > 10 * 60 * 1000) { // 10 minutes
            jobStatus.delete(id);
        }
    }

    return NextResponse.json(job);
}