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

router.post("/request", 
  checkAuth(...Object.values(Role)),
 validateRequest(requestRideSchema), 
 rideControler.requestRide)
router.get("/", checkAuth(Role.ADMIN, Role.DRIVER), rideControler.getAllRides)
router.get("/myHistory", checkAuth(...Object.values(Role)), rideControler.getRideMyHistory)
router.patch("/cancel/:id", checkAuth(Role.RIDER), rideControler.cancelRide)
router.patch("/rideStatus/:rideId", checkAuth(Role.ADMIN, Role.DRIVER), rideControler.updateRideStatus)
router.get(
  "/earnings",
  checkAuth(Role.DRIVER),
  rideControler.viewEarningHistory
);



export const RideRoutes = router

