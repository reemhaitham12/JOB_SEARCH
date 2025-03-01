import {Router} from "express"
import * as jobServer from "./service/job.service.js"
const router = new Router()
router.post("/",jobServer.addJob)
export default router