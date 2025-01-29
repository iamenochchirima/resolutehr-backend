// import axios from "axios";
// import OpenAI from "openai";
// import { Request, Response } from "express";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// require("dotenv").config();

// export const chatGPT = async (req: Request, res: Response) => {
//   try {
//     const options = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4o",
//         messages: [{ role: "user", content: req.body.message }],
//         max_tokens: 300,
//       }),
//     };
//     const response = await fetch(
//       "https://api.openai.com/v1/chat/completions",
//       options
//     );
//     const data = await response.json();
//     res.send(data);
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({
//         message: "Error communicating with OpenAI",
//         error: error?.response?.data,
//       });
//   }
// };

// export const streamChatGPT = async (req: Request, res: Response) => {
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");

//   try {
//     const stream = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [{ role: "user", content: req.body.message}],
//       stream: true,
//     });

//     for await (const chunk of stream) {
//       const data = chunk.choices[0]?.delta?.content || "";
//       process.stdout.write(data);
//       res.write(`${JSON.stringify(data)}`); 
//     }

//     res.end(); // Close the connection once streaming is complete
//   } catch (error) {
//     console.error("Error streaming with OpenAI", error);
//     res.status(500).send("An error occurred while streaming with OpenAI.");
//   }
// };


