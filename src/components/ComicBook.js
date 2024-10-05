"use client";
import React, { useState } from "react";
import axios from "axios";
import { rpcClient } from "@/services/rpc-client";

const ComicBook = () => {
	const [prompt, setPrompt] = useState("");
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const generateComic = async () => {
		setLoading(true);
		setError(null);
		setData(null);

		try {
			// Generate a unique ID for this request
			const uid = Date.now();

			// First API call to create the comic
			// const createResponse = await axios.post('https://charming-wilson-intelligent.lemme.cloud/api/toonify', {
			//     method: "create",
			//     params: {
			//         uid: uid,
			//         prompt: prompt
			//     }
			// });

			let createResponse = await rpcClient("create", { uid, prompt });
			console.log(createResponse);
			if (createResponse.status === 200) {
				// Second API call to get the data
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
				<button
					onClick={generateComic}
					disabled={loading}
					className='w-full px-4 py-3 text-slate-900 font-bold bg-yellow-500 rounded-lg shadow-lg hover:bg-yellow-400 transition-all duration-200 ease-in-out hover:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50'>
					{loading ? "Generating..." : "Generate Epic Comic"}
				</button>
			</div>
			{loading && <p>Loading...</p>}
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
					{[
						"s1",
						"s2",
						"s3",
						"s4",
						"img1",
						"img2",
						"img3",
						"img4",
					].map((key) => (
						<div
							key={key}
							className='bg-white rounded-lg shadow-lg overflow-hidden border-4 border-yellow-400 transition-transform transform hover:scale-105'>
							{key.startsWith("img") ? (
								<img
									src={data[key]}
									alt={`Comic panel ${key}`}
									className='w-full h-auto'
								/>
							) : (
								<div className='p-4 bg-gray-100'>
									<p className='text-sm font-medium text-gray-800 font-comic'>
										{data[key]}
									</p>
								</div>
							)}
						</div>
					))}
				</div>
			)}
			<style jsx>{`
				.toonify-heading {
					font-size: 7rem;
					font-weight: bold;
					color: #ffeb3b;
					text-shadow: 3px 3px 0 rgba(255, 0, 0, 0.8),
						5px 5px 0 rgba(255, 0, 0, 0.6);
					font-family: "Impact", sans-serif;
					letter-spacing: 5px;
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
		</div>
	);
};

export default ComicBook;
