import { protect } from "../middlewares/auth";
import { chatGPT, streamChatGPT } from "../controllers/api";
import { Router } from "express";

export default (router: Router) => {
    router.post("/completions",  chatGPT)
    router.post("/stream", streamChatGPT)
}