
import AppError from "../../../errorHelpers/AppError";
import { IRide, RideStatus } from "./ride.interfaces";
import { Ride } from "./ride.model";
import httpStatus from "http-status-codes"

 const requestRide = async (payload: Partial<IRide>) => {
  if (!payload.rider) {
    throw new Error("Rider information is missing.");
  }

  const existingActiveRide = await Ride.findOne({
    rider: payload.rider,
    status: { $in: ["requested", "accepted", "picked_up", "in_transit"] },
  });

  if (existingActiveRide) {
    throw new Error("You already have an active ride in progress.");
  }

  const ride = await Ride.create(payload);
  return ride;
};


const cancelRide = async (rideId: string, riderId: string) => {

  const ride = await Ride.findOne({ _id: rideId, rider: riderId });

  if (!ride) {
    throw new Error("Ride not found or you are not authorized");
  }

 
  const requestedAt = ride.timestamps.requestedAt;
  const now = new Date();

const diffMs = now.getTime() - requestedAt.getTime();
const diffDays = diffMs / (1000 * 60 * 60 * 24); 

if (diffDays > 1) {
  throw new Error("You can cancel ride only within 1 day of request");
}

 
  if (ride.status !== "requested") {
    throw new Error("Ride cannot be cancelled at this stage");
  }


  ride.status = "cancelled_by_rider";
  ride.timestamps.cancelledAt = now;

  await ride.save();

  return ride;
};

const getRideMyHistory = async (riderId: string, limit = 10) => {
  const rides = await Ride.find({ rider: riderId })
    .sort({ createdAt: -1 })
    .limit(limit);
  return rides;
};

const getAllRides = async () => {
  const rides = await Ride.find()
    .populate("rider", "name email")           
    .sort({ createdAt: -1 });       
  const totalUsers = await Ride.countDocuments()         

  return {
    data: rides,
    meta: {
      total : totalUsers
    }
    
  };
};


const validTransitions: Record<RideStatus, RideStatus[]> = {
  requested: ["accepted", "cancelled_by_rider", "no_driver_available"],
  accepted: ["picked_up", "cancelled_by_driver"],
  picked_up: ["in_transit"],
  in_transit: ["completed"],
  completed: [],
  cancelled_by_rider: [],
  cancelled_by_driver: [],
  no_driver_available: [],
};

 const statusToTimestampField: Record<RideStatus, keyof IRide["timestamps"] | null> = {
  requested: "requestedAt",
  accepted: "acceptedAt",
  picked_up: "pickedUpAt",
  in_transit: "inTransitAt",
  completed: "completedAt",
  cancelled_by_driver: "cancelledAt",
  cancelled_by_rider: "cancelledAt",
  no_driver_available: "cancelledAt",
};

 const updateRideStatus = async (rideId: string, newStatus: RideStatus) => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }

  const currentStatus = ride.status;
  const allowedNextStatuses = validTransitions[currentStatus];

  if (!allowedNextStatuses.includes(newStatus)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid status transition from '${currentStatus}' to '${newStatus}'`
    );
  }

 
  ride.status = newStatus;

  const timestampField = statusToTimestampField[newStatus];
  if (timestampField) {
    ride.timestamps[timestampField] = new Date();
  }

  await ride.save();
  return ride;
};


export const RideService = {

  requestRide,
  cancelRide,
  getRideMyHistory,
  getAllRides,
  updateRideStatus

}





 


   
