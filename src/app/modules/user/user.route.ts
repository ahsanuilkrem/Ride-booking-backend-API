import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controler";
import { creatUserZodSchema } from "./user.validation";
import { ZodObject, ZodRawShape } from "zod";
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


router.post("/register", validateRequest(creatUserZodSchema), UserControllers.createUser)
router.get("/all-users", UserControllers.getAllUsers)

export const UserRoutes = router