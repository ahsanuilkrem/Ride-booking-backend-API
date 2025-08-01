import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controler";
import { creatUserZodSchema, updateUserZodSchema } from "./user.validation";
import { ZodObject, ZodRawShape } from "zod";
import { Role } from "./user.interfaces";
import { checkAuth } from "../../../middiewares/checkAuth";

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
router.get("/all-users", checkAuth(Role.ADMIN), UserControllers.getAllUsers)
router.patch("/:id", validateRequest(updateUserZodSchema),checkAuth(...Object.values(Role)), UserControllers.updateUser)
router.patch('/block/:id',validateRequest(updateUserZodSchema), checkAuth(Role.ADMIN), UserControllers.Userblock) ;
router.patch('/unblock/:id', checkAuth(Role.ADMIN), validateRequest(updateUserZodSchema), UserControllers.UserUnblock) ;
export const UserRoutes = router


