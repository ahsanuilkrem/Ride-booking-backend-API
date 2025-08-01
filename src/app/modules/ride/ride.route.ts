import { NextFunction, Request, Response, Router } from "express";
import { rideControler } from "./ride.controler";
import { requestRideSchema } from "./ride.validation";
import { ZodObject, ZodRawShape } from "zod";
import { checkAuth } from "../../../middiewares/checkAuth";
import { Role } from "../user/user.interfaces";

type AnyZodObject = ZodObject<ZodRawShape>;



const validateRequest = (zodSchema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
   try {
     req.body = await zodSchema.parseAsync(req.body)
      next()
   } catch (error) {
     next(error)
   }
}

const router = Router()

router.post("/request", checkAuth(Role.RIDER), validateRequest(requestRideSchema), rideControler.requestRide )
router.patch("/cancel/:id", checkAuth(Role.RIDER), rideControler.cancelRide)
router.get("/myHistory", checkAuth(Role.RIDER), rideControler.getRideMyHistory)
router.get("/allRides", checkAuth(Role.ADMIN, Role.DRIVER), rideControler.getAllRides)
router.patch("/updateStatus/:id", checkAuth(Role.ADMIN, Role.DRIVER), rideControler.updateRideStatus)



export const RideRoutes = router




