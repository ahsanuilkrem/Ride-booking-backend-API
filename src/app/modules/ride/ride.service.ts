
import AppError from "../../../errorHelpers/AppError";
import { PAYMENT_STATUS } from "../payment/payment.interfaces";
import { Payment } from "../payment/payment.model";
import { User } from "../user/user.model";
import { IRide, RideStatus, } from "./ride.interfaces";
import httpStatus from "http-status-codes"
import { Ride } from "./ride.model";
import { Types } from "mongoose";


const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}

const requestRide = async (payload: Partial<IRide>, userId: string) => {

  const transanctionId = getTransactionId()

  const session = await Ride.startSession();
  session.startTransaction()

  try {

    const user = await User.findById(userId)

    if (!user?.phone || !user?.address) {
      throw new AppError(httpStatus.BAD_REQUEST, "Please Update Your Profile to Booking a User.")
    }

    const ride = await Ride.create([{
      user: userId,
      status: RideStatus.requested,
      ...payload,
    }], {session});

    // const driver = await Driver.findById(payload.).select("earnings")

    // if(!driver?.earnings){
    //   throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost Found!")
    // }

    // const amount = Number(driver.earnings)

    const payment = await Payment.create([{
       rider: ride[0]._id,
      status: PAYMENT_STATUS.UNPAID,
      transanctionId: transanctionId,
      amount: 455,

    }], {session})

    const updateRide = await Ride.findByIdAndUpdate(ride[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session }
    )
    .populate("user")
    .populate("payment")
    .populate("driver")
   await session.commitTransaction();
   session.endSession()
    return updateRide;
  } catch (error) {
    await session.abortTransaction();
    session.endSession()
    throw error
  }


};


export const cancelRide = async (rideId: string) => {
  if (!Types.ObjectId.isValid(rideId)) {
    throw new Error("Invalid Ride ID");
  }

  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (!ride.rideTimestamps?.acceptedAt) {
    throw new Error("Cannot cancel: Ride has not been accepted yet");
  }

  const acceptedAt = new Date(ride.rideTimestamps.acceptedAt);
  const now = new Date();

  const diffMs = now.getTime() - acceptedAt.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24); 

  if (diffDays > 1) {
    throw new Error("You can only cancel a ride within 1 day of acceptance");
  }

  if (ride.status !== RideStatus.requested) {
    throw new Error("Ride cannot be cancelled at this stage");
  }

  ride.status = RideStatus.cancelled_by_rider;
  if (!ride.rideTimestamps) {
    ride.rideTimestamps = {};
  }
  ride.rideTimestamps.cancelledAt = now;

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
    // .populate("ride", "name email")
    .sort({ createdAt: -1 });
  const totalUsers = await Ride.countDocuments()

  return {
    data: rides,
    meta: {
      total: totalUsers
    }

  };
};

const validTransitions: Record<RideStatus, RideStatus[]> = {
  requested: [RideStatus.accepted, RideStatus.cancelled_by_driver, RideStatus.no_driver_available],
  accepted: [RideStatus.picked_up, RideStatus.cancelled_by_driver],
  picked_up: [RideStatus.in_transit],
  in_transit: [RideStatus.completed],
  completed: [],
  cancelled_by_rider: [],
  cancelled_by_driver: [],
  no_driver_available: [],
};

// Status -> timestamp mapping
const statusToTimestampField: Record<
  RideStatus,
  keyof NonNullable<IRide["rideTimestamps"]> | null
> = {
  requested: "requestedAt",
  accepted: "acceptedAt",
  picked_up: "pickedUpAt",
  in_transit: "inTransitAt",
  completed: "completedAt",
  cancelled_by_driver: "cancelledAt",
  cancelled_by_rider: "cancelledAt",
  no_driver_available: "cancelledAt",
};

export const updateRideStatus = async (rideId: string, newStatus: RideStatus) => {
  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }

  const currentStatus = ride.status as RideStatus;
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
    ride.rideTimestamps = ride.rideTimestamps || {};
    ride.rideTimestamps[timestampField] = new Date();
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









