import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./middiewares/globalErrorHandler";
import notFound from "./middiewares/notFound";
import cookieParser from "cookie-parser";



const app = express()
app.use(cookieParser())
app.use(express.json())
app.set("trust proxy", 1)
app.use(cors())



 app.use("/api", router)

app.get("/", ( req: Request, res: Response) => {
    res.status(200).json({
        message: "welcome Ride Booking System Backend API"
    })
} )


 app.use(globalErrorHandler)

 app.use(notFound)


export default app;