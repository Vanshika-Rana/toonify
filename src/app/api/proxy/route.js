import { v4 as uuidv4 } from "uuid"; // Generate unique job IDs

let jobs = {}; // Store job status and result

// Handle POST request to initiate the API call
export async function POST(req) {
    const jobId = uuidv4(); // Create a unique job ID
    jobs[jobId] = { status: "processing", result: null }; // Set initial job status

    // Start processing the long-running task asynchronously
    processApiCall(await req.text(), jobId);

    // Return the job ID immediately to the client
    return new Response(JSON.stringify({ jobId, status: "processing" }), { status: 202 });
}

// Asynchronously process the long-running task (calling the external API)
async function processApiCall(requestBody, jobId) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: requestBody,
        });

        if (!response.ok) {
            throw new Error(`External API error! status: ${response.status}`);
        }

        const data = await response.json();
        jobs[jobId] = { status: "completed", result: data }; // Store the result when completed
    } catch (error) {
        console.error("Error in proxy:", error);
        jobs[jobId] = { status: "error", result: null }; // Handle error state
    }
}

// Handle GET request to check the status of the job
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    if (jobs[jobId]) {
        return new Response(JSON.stringify(jobs[jobId]), { status: 200 });
    } else {
        return new Response(JSON.stringify({ status: "not_found" }), { status: 404 });
    }
}
