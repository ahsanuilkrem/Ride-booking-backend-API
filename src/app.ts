import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./middiewares/globalErrorHandler";
import notFound from "./middiewares/notFound";



const app = express()
app.use(express.json())
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