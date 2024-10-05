import axios from "axios";

const RPC_URL = "https://charming-wilson-intelligent.lemme.cloud/api/toonify";

export const rpcClient = async (method, params = {}) => {
  try {
    const response = await axios.post(RPC_URL, {
      jsonrpc: "2.0",
      method,
      params,
    });

   

    return response
  } catch (error) {
    console.error("RPC call failed:", error.message);
    throw error;
  }
};