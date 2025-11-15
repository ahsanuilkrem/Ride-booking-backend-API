import express from "express";
import { StatsController } from "./stats.controller";
import { checkAuth } from "../../../middiewares/checkAuth";
import { Role } from "../user/user.interfaces";

const router = express.Router();

// Public, unauthenticated homepage stats (safe aggregates only)
router.get("/public", StatsController.getPublicHomepageStats);

// Dashboard stats - overview of all key metrics
router.get(
  "/dashboard",
  checkAuth(Role.ADMIN),
  StatsController.getDashboardStats
);

// Ride statistics
router.get(
  "/rides",
  checkAuth(Role.ADMIN),
  StatsController.getRideStats
);

// User statistics
router.get(
  "/users",
  checkAuth(Role.ADMIN),
  StatsController.getUserStats
);

// Driver statistics
router.get(
  "/drivers",
  checkAuth(Role.ADMIN),
  StatsController.getDriverStats
);

// Revenue statistics
router.get(
  "/revenue",
  checkAuth(Role.ADMIN),
  StatsController.getRevenueStats
);

export const StatsRoutes = router;