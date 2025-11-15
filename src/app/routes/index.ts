import { Router } from "express"
import { UserRoutes } from "../modules/user/user.route"
import { AuthRouter } from "../modules/auth/auth.route"
import { RideRoutes } from "../modules/ride/ride.route"
import { DriverRoutes } from "../modules/driver/driver.route"
import { StatsRoutes } from "../modules/stats/stats.route"




export const router = Router()



const moduleRoutes = [
    {
        path: "/user",
        router: UserRoutes
    },
    {
        path: "/auth",
        router: AuthRouter
    },
    {
        path: "/rides",
        router: RideRoutes
    },
    {
        path: "/driver",
        router: DriverRoutes
    },
    {
        path: "/stats",
        router: StatsRoutes
    },
]


moduleRoutes.forEach((route) => {
    router.use(route.path, route.router)
})