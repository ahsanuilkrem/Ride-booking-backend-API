import { NextFunction, Request, Response, Router } from "express";
import { ZodObject, ZodRawShape } from "zod";
import { createDriverSchema, updateAvailabilityZodSchema, updateDriverSchema, updateMyDriverProfileZodSchema} from "./driver.validation";
import { DriverControler } from "./driver.controler";
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

const router = Router();
router.get("/", checkAuth(...Object.values(Role)), DriverControler.getAllDriver);
router.post("/create", checkAuth(...Object.values(Role)), validateRequest(createDriverSchema), DriverControler.createDriver);
router.patch("/availability/:id",checkAuth(Role.DRIVER), validateRequest(updateDriverSchema), DriverControler.toggleAvailability);
router.patch(
  "/status/:driverId",
  checkAuth(Role.ADMIN),
  // validateRequest(updateDriverStatusZodSchema),
  DriverControler.updateDriverStatus
);
router.patch(
  "/update-my-profile",
  checkAuth(Role.DRIVER),
  validateRequest(updateMyDriverProfileZodSchema),
  DriverControler.updateMyDriverProfile
);
router.get(
  "/my-profile",
  checkAuth(Role.DRIVER),
  DriverControler.getMyDriverProfile
);
router.patch("/update-availability",checkAuth(Role.DRIVER),validateRequest(updateAvailabilityZodSchema),DriverControler.updateAvailability);
router.get(
  "/my-ride-history",
  checkAuth(Role.DRIVER),
  DriverControler.getDriverRideHistory
);

router.get("/earnings/:id", DriverControler.getEarnings);


export const DriverRoutes = router;

