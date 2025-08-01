import { Router } from "express"
import { Authcontrollers } from "./auth.controler"
import { checkAuth } from "../../../middiewares/checkAuth"
import { Role } from "../user/user.interfaces"


const router = Router()

router.post("/login", Authcontrollers.credentialsLogin)
router.post("/refresh-token", Authcontrollers.getNewAccessToken)
router.post("/logout", Authcontrollers.logout)
router.post("/reset-password", checkAuth(...Object.values(Role)), Authcontrollers.resetPassword)


export const AuthRouter = router