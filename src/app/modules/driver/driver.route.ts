import { NextFunction, Request, Response, Router } from "express";
import { ZodObject, ZodRawShape } from "zod";
import { createDriverSchema, updateDriverSchema } from "./driver.validation";
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

router.post("/create", validateRequest(createDriverSchema), DriverControler.createDriver)
router.patch("/availability/:id",checkAuth(Role.ADMIN, Role.DRIVER), validateRequest(updateDriverSchema), DriverControler.updateStatus);
router.get("/", checkAuth(Role.ADMIN), DriverControler.getAllDriver);
router.get("/earnings/:id", DriverControler.getEarnings);


export const DriverRoutes = router;

