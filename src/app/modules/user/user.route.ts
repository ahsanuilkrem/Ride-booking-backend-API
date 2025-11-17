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
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe)

router.patch("/:id",
  checkAuth(...Object.values(Role)),
  //  validateRequest(updateUserZodSchema), 
  UserControllers.updateUser)

router.patch('/block/:id',
  checkAuth(Role.ADMIN),
  validateRequest(updateUserZodSchema),
  UserControllers.Userblock);

router.patch('/unblock/:id',
  checkAuth(Role.ADMIN),
  validateRequest(updateUserZodSchema),
  UserControllers.UserUnblock);

router.patch("/updateUser/:id", 
  checkAuth(...Object.values(Role)), 
  // validateRequest(updateUserZodSchema), 
   UserControllers.updateUserProfile)  



export const UserRoutes = router


