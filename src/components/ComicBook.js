"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";

const ComicBook = () => {
	const [prompt, setPrompt] = useState("");
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [loaderIndex, setLoaderIndex] = useState(0);
	const messages = [
		"Unleashing comic superpowers...",
		"Sketching the next masterpiece...",
		"Brewing a potion of creativity...",
		"Summoning the comic gods...",
		"Perfecting every panel...",
		"Adding that extra sprinkle of magic...",
		"Almost there, hang tight!",
		"Final touches in progress...",
	];

	useEffect(() => {
		let messageInterval;
		if (loading) {
			messageInterval = setInterval(() => {
				setLoaderIndex(
					(prevIndex) => (prevIndex + 1) % messages.length
				);
			}, 10000);
		}
		return () => clearInterval(messageInterval);
	}, [loading, messages.length]);

	const fetchDataWithRetry = async (retries = 3) => {
		setLoading(true);
		setError(null);
		setData(null);

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 330000); // 5.5 minutes timeout

		try {
			const response = await fetch("/api/proxy", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ prompt }),
				signal: controller.signal,
			});

			if (!response.ok) {
				// Log the status for debugging
				console.error(`HTTP error! status: ${response.status}`);
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			setData(result);
			setPrompt(""); // Clear the input field after generating the comic
		} catch (error) {
			console.error("Fetch error:", error);

			if (error.name === "AbortError") {
				setError("Request timed out. Please try again.");
			 } 
             // else if (retries > 0) {
			// 	console.log(`Retrying... ${retries} attempts left`);
			// 	return fetchDataWithRetry(retries - 1);
			// } 
            else {
				setError(
					`An error occurred: ${error.message}. Please try again.`
				);
			}
		} finally {
			setLoading(false);
			clearTimeout(timeoutId);
		}
	};

	return (
		<>
			<Head>
				<title>Comic Book Generator Extraordinaire</title>
				<link
					href='https://fonts.googleapis.com/css2?family=Chewy&display=swap'
					rel='stylesheet'
				/>
			</Head>
			<div className='flex flex-col justify-center items-center min-h-screen py-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900 to-slate-900'>
				<h1 className='toonify-heading'>TOONIFY!</h1>
				<p className='text-center text-indigo-200 mb-8 text-xl md:text-2xl'>
					Unleash your creativity and watch as AI brings your wildest
					comic ideas to life!
				</p>
				<div className='mb-8 w-full max-w-md'>
					<input
						type='text'
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						placeholder='Enter your epic comic idea here...'
						disabled={loading}
						className='w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-white shadow-md'
					/>
					<div className='relative'>
						<div className='absolute -inset-2 rounded-lg bg-gradient-to-t from-red-600 via-rose-600 to-red-600 opacity-50 blur-2xl'></div>
					</div>
					<button
						onClick={fetchDataWithRetry}
						disabled={loading}
						className='w-full px-4 py-3 text-slate-900 font-bold bg-yellow-500 rounded-lg shadow-lg hover:bg-yellow-400 transition-all duration-200 ease-in-out hover:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50'>
						{loading ? "Generating..." : "Generate Epic Comic"}
					</button>
				</div>
				<p className='text-white font-bold text-center pb-6'>
					Built with ❤️ using{" "}
					<a
						href='https://app.lemmebuild.com'
						target='_blank'
						rel='noopener noreferrer'
						className='text-yellow-400 hover:text-yellow-300'>
						LemmeBuild
					</a>
				</p>
				{loading && (
					<div className='flex flex-col items-center'>
						<div className='loader'></div>
						<p className='mt-4 text-xl font-bold text-blue-500'>
							{messages[loaderIndex]}
						</p>
					</div>
				)}
				{error && (
					<div
						className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
						role='alert'>
						<strong className='font-bold'>Error: </strong>
						<span className='block sm:inline'>{error}</span>
					</div>
				)}
				{data && (
					<div className='grid grid-cols-1 md:grid-cols-2 gap-8 px-8 md:px-12 lg:px-36'>
						{Object.keys(data.story).map((key, index) => (
							<div
								key={key}
								className='bg-white rounded-lg shadow-lg overflow-hidden border-4 border-yellow-400 transition-transform transform hover:scale-105'>
								<img
									src={data[`img${index + 1}`]}
									alt={`Comic panel ${index + 1}`}
									className='w-full h-auto'
								/>
								<div className='p-4 bg-gray-100'>
									<p className='text-sm font-medium text-gray-800 font-comic'>
										{data.story[key]}
									</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<style jsx>{`
				.toonify-heading {
					font-size: 7rem; /* Increased size */
					font-weight: bold;
					color: #ffeb3b; /* Bright yellow */
					text-shadow: 3px 3px 0 rgba(255, 0, 0, 0.8),
						5px 5px 0 rgba(255, 0, 0, 0.6); /* Red shadows */
					font-family: "Impact", sans-serif; /* Updated font to Impact */
					letter-spacing: 5px; /* Added letter spacing */
				}
				.loader {
					width: 60px;
					height: 60px;
					border: 6px solid #00bfff;
					border-top: 6px solid transparent;
					border-radius: 50%;
					animation: spin 1s linear infinite;
				}

				@keyframes spin {
					0% {
						transform: rotate(0deg);
					}
					100% {
						transform: rotate(360deg);
					}
				}
			`}</style>
		</>
	);
};

export default ComicBook;
