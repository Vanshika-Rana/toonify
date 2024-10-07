"use client";
import React, { useState, useEffect } from "react";
import { rpcClient } from "@/services/rpc-client";
import { AlertCircle } from "lucide-react";

const ComicBook = () => {
	const [prompt, setPrompt] = useState("");
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [currentFact, setCurrentFact] = useState("");
	const [inputError, setInputError] = useState(false);
	const [generatedPrompt, setGeneratedPrompt] = useState(""); // New state for storing the generated prompt

	const funFacts = [
		"The first comic book was published in 1933!",
		"Superman can't see through lead with his X-ray vision.",
		"The Hulk was originally supposed to be gray, not green!",
		"Batman and Daredevil were both inspired by the same source: Zorro.",
		"Spider-Man's web-shooters were mechanical in the comics, not organic like in some movies.",
		"Wonder Woman's lasso not only compels truth but is also unbreakable.",
		"Deadpool knows he's in a comic book - he often breaks the fourth wall!",
		"The Flash can run so fast, he can travel through time.",
		"In the comics, Thanos' snap affected the entire universe, not just half.",
		"The X-Men were originally going to be called 'The Mutants'.",
	];

	useEffect(() => {
		if (loading) {
			const interval = setInterval(() => {
				setCurrentFact(
					funFacts[Math.floor(Math.random() * funFacts.length)]
				);
			}, 3000);
			return () => clearInterval(interval);
		}
	}, [loading]);

	const generateComic = async () => {
		if (!prompt.trim()) {
			setInputError(true);
			return;
		}

		setInputError(false);
		setLoading(true);
		setError(null);
		setData(null);
		setCurrentFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
		setGeneratedPrompt(prompt); // Store the prompt that was used to generate the comic

		try {
			const uid = Date.now();
			let createResponse = await rpcClient("create", { uid, prompt });
			if (createResponse.status === 200) {
				let getDataResponse = await rpcClient("getData", { uid });
				if (getDataResponse.status === 200) {
					setData(getDataResponse.data.response[0]);
				} else {
					throw new Error("Failed to fetch comic data");
				}
			} else {
				throw new Error("Failed to create comic");
			}
		} catch (error) {
			console.error("Error generating comic:", error);
			setError(`Failed to generate comic: ${error.message}`);
		} finally {
			setLoading(false);
			setPrompt("");
		}
	};

	return (
		<div className='min-h-screen bg-black text-white font-sans p-4 flex flex-col items-center justify-center'>
			<div className='w-full max-w-3xl text-center mb-12'>
				<h1 className='text-6xl md:text-7xl lg:text-8xl font-black mb-4 gradient-text'>
					TOONIFY!
				</h1>
				<p className='text-xl text-gray-400 mb-8'>
					Unleash your creativity and watch as AI brings your wildest
					comic ideas to life!
				</p>
				<div className='flex flex-col sm:flex-row gap-4 mb-8'>
					<input
						type='text'
						value={prompt}
						onChange={(e) => {
							setPrompt(e.target.value);
							setInputError(false);
						}}
						placeholder='Enter your comic idea here...'
						className={`flex-grow px-4 py-2 bg-gray-900 text-white border ${
							inputError ? 'border-red-500' : 'border-gray-700'
						} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
					/>
					<button
						onClick={generateComic}
						disabled={loading}
						className='px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'>
						{loading ? "Generating..." : "Generate"}
					</button>
				</div>

				{inputError && (
					<div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
						<AlertCircle className="flex-shrink-0 inline w-4 h-4 mr-3" />
						<span className="sr-only">Error</span>
						<div>
							Please enter a comic idea before generating.
						</div>
					</div>
				)}

				{loading && (
					<div className='mb-8'>
						<div className='loader mb-4'></div>
						<p className='text-purple-400 text-xl mb-4'>
							Creating your masterpiece...
						</p>
						<div className='bg-gray-900 p-4 rounded-md'>
							<p className='text-gray-300 text-lg italic'>
								&quot;{currentFact}&quot;
							</p>
						</div>
					</div>
				)}
			</div>

			{error && (
				<div
					className='w-full max-w-3xl bg-red-900 text-white p-4 rounded-md mb-4'
					role='alert'>
					<p className='font-bold'>Error: {error}</p>
				</div>
			)}

			{data && (
				<>
					<div className='w-full max-w-3xl mb-8'>
						
						<p className='text-xl text-purple-400 uppercase text-center font-bold'>{generatedPrompt}</p>
					</div>
					<div className='w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-4'>
						{[
							{ key: "s1", img: "img1" },
							{ key: "s2", img: "img2" },
							{ key: "s3", img: "img3" },
							{ key: "s4", img: "img4" },
						].map(({ key, img }) => (
							<div
								key={key}
								className='bg-gray-900 rounded-md overflow-hidden'>
								<img
									src={data[img]}
									alt={`Comic panel ${img}`}
									className='w-full h-auto object-cover'
								/>
								<p className='p-3 text-sm text-gray-300'>
									{data[key]}
								</p>
							</div>
						))}
					</div>
				</>
			)}

			<style jsx>{`
				.gradient-text {
					background: linear-gradient(to right, #a855f7, #3b82f6);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
				}

				.loader {
					width: 80px;
					height: 80px;
					background-color: #a855f7;
					clip-path: polygon(
						50% 0%,
						61% 35%,
						98% 35%,
						68% 57%,
						79% 91%,
						50% 70%,
						21% 91%,
						32% 57%,
						2% 35%,
						39% 35%
					);
					display: inline-block;
					animation: pulse 1s ease-in-out infinite alternate;
				}

				@keyframes pulse {
					from {
						transform: scale(1);
					}
					to {
						transform: scale(1.2);
					}
				}
			`}</style>
		</div>
	);
};

export default ComicBook;