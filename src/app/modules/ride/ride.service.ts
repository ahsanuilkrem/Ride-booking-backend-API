/* eslint-disable @typescript-eslint/no-unused-vars */


import AppError from "../../../errorHelpers/AppError";
import { PAYMENT_STATUS } from "../payment/payment.interfaces";
import { Payment } from "../payment/payment.model";
import { User } from "../user/user.model";
import { IRide, RideStatus, } from "./ride.interfaces";
import httpStatus from "http-status-codes"
import { Ride } from "./ride.model";
import { Types } from "mongoose";
import { calculateDistanceInKm, calculateFare } from "../../../middiewares/distance";
import { QueryBuilder } from "../../../utils/QueryBuilder";
import { riderSchemaSearchableFields } from "./ride.constant";
import { Driver } from "../driver/driver.model";
import { availaStatus, IsStatus } from "../driver/driver.interfaces";
import { ACTIVE_RIDE_STATUSES, getFullRideStatusFlow, rideStatusFlow } from "./rideStatus";




const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}

const requestRide = async (payload: Partial<IRide>, userId: string) => {

  const transanctionId = getTransactionId()

  const session = await Ride.startSession();
  session.startTransaction()

  try {

    const user = await User.findById(userId)

    // if (!user?.phone || !user?.address) {
    //   throw new AppError(httpStatus.BAD_REQUEST, "Please Update Your My Profile ")
    // }

    const ride = await Ride.create([{
      userId: userId,
      status: RideStatus.requested,
      fare: 0,
      ...payload,
    }], { session });

    const { pickupLocation, destinationLocation } = payload;

    if (!pickupLocation || !destinationLocation) {
      throw new AppError(httpStatus.BAD_REQUEST, "Pickup and Destination locations are required.");
    }

    const distance = calculateDistanceInKm(
      pickupLocation.lat,
      pickupLocation.lng,
      destinationLocation.lat,
      destinationLocation.lng
    );

    const amount = calculateFare(distance);

    const payment = await Payment.create([{
      rider: ride[0]._id,
      status: PAYMENT_STATUS.UNPAID,
      transanctionId: transanctionId,
      amount: amount.toFixed(1),

    }], { session })

    const updateRide = await Ride.findByIdAndUpdate(ride[0]._id,
      {
        payment: payment[0]._id,
        fare: amount.toFixed(1),
      },
      { new: true, runValidators: true, session }
    )
      .populate("userId")
      .populate("payment")


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

const getRideMyHistory = async (
  userId: string,
  query: Record<string, string>
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const queryBuilder = new QueryBuilder(Ride.find({ userId: userId, }), query)

  const rides = await queryBuilder
    .search(riderSchemaSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()

  const [data, meta] = await Promise.all([
    rides.build(),
    queryBuilder.getMeta()
  ])
  return {
    data: data,
    meta: meta,
  };
};

const getAllRides = async (userId: string, query: Record<string, string>) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const queryBuilder = new QueryBuilder(Ride.find(), query);
   const ridesQuery = queryBuilder
    .search(riderSchemaSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    ridesQuery.build(),
    queryBuilder.getMeta(),
  ]);

  // const rides = await Ride.find()
  //   // .populate("ride", "name email")
  //   .sort({ createdAt: -1 });
  // const totalUsers = await Ride.countDocuments()

  return {
    data,
    meta,
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

const updateRideStatus = async (userId: string, rideId: string, newStatus: RideStatus) => {

  const session = await Ride.startSession();

  try {
    session.startTransaction();

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
    }

    const driver = await Driver.findOne({ userId });
    if (!driver) {
      throw new AppError(httpStatus.BAD_REQUEST, "Driver profile not found");
    }

    // Reject based on driver status
    if (driver.status === undefined) {
      throw new AppError(httpStatus.BAD_REQUEST, "Driver status missing");
    }
    if (
      [
        IsStatus.PENDING,
        IsStatus.REJECTED,
        IsStatus.SUSPEND,
      ].includes(driver.status)
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Your driver status is '${driver.status}', you cannot update rides`
      );
    }

    if (driver.availability === availaStatus.UNAVAILABLE) {
      throw new AppError(httpStatus.BAD_REQUEST, "You are currently offline");
    }

    // ✅ Vehicle type check
    // if (driver.vehicleType !== ride.vehicleType) {
    //   throw new AppError(
    //     httpStatus.BAD_REQUEST,
    //     `Vehicle type mismatch. You are registered with '${driver.vehicleType}', but this ride requires '${ride.vehicleType}'.`
    //   );
    // }

    // ✅ Prevent driver from accepting multiple active rides
    if (newStatus === RideStatus.accepted) {
      const alreadyActiveRide = await Ride.findOne({
        userId: userId,
        status: { $in: ACTIVE_RIDE_STATUSES },
      });

      if (alreadyActiveRide) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "You already have an active ride"
        );
      }
    }

    if (newStatus === RideStatus.cancelled_by_driver) {
      throw new AppError(httpStatus.BAD_REQUEST, "Drivers cannot cancel rides");
    }

    if (ride.status === RideStatus.cancelled_by_rider) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Ride has already been cancelled"
      );
    }

    // ⛔ Prevent invalid transitions
    const allowedNextStatuses = rideStatusFlow[ride.status];
    // if (!allowedNextStatuses.includes(newStatus)) {
    //   throw new AppError(
    //     httpStatus.BAD_REQUEST,
    //     `Invalid ride status transition from '${ride.status}' to '${newStatus}'`
    //   );
    // }

    if (!allowedNextStatuses.includes(newStatus)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Invalid ride status transition from '${ride.status}' to '${newStatus}'.\n` +
        `Ride status must follow this flow:\n${getFullRideStatusFlow()}`
      );
    }

    // ⛔ Only assigned driver can update ride after acceptance
    // if (
    //   ride.driver &&
    //   ride.driver.toString() !== userId &&
    //   [
    //     RideStatus.accepted,
    //     RideStatus.picked_up,
    //     RideStatus.in_transit,
    //   ].includes(ride.status)
    // ) {
    //   throw new AppError(
    //     httpStatus.FORBIDDEN,
    //     "You are not assigned to this ride"
    //   );
    // }

    // Timestamp mapping
    const now = new Date();
    const statusToTimestampField: Record<
      RideStatus,
      keyof NonNullable<IRide["rideTimestamps"]> 
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


    const updateData: Partial<IRide> = { status: newStatus, rideTimestamps: {
        ...ride.rideTimestamps,
        [statusToTimestampField[newStatus]]: now,
      },
    };

    // ✅ Assign driver on first accept
    if (!ride.driver && newStatus === RideStatus.accepted) {
      updateData.driver = new Types.ObjectId(userId);
    }

    // ✅ Add fare to earnings on completion
    if (newStatus === RideStatus.completed && ride.fare && driver) {
      await Driver.updateOne(
        { userId },
        { $inc: { earnings: ride.fare } },
        { session }
      );
    }

    const updatedRide = await Ride.findByIdAndUpdate(rideId, updateData, {
      new: true,
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return updatedRide;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const viewEarningHistory = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const driver = await Driver.findOne({ userId });
  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }

  const completedRides = await Ride.find({
    driver: driver._id,
    status: RideStatus.completed,
  }).sort({ "timestamps.completedAt": -1 }); // Most recent first

  const totalEarnings = completedRides.reduce(
    (acc, ride) => acc + (ride.fare || 0),
    0
  );

  return {
    totalRides: completedRides.length,
    totalEarnings,
    rides: completedRides,
  };
};



export const RideService = {

  requestRide,
  cancelRide,
  getRideMyHistory,
  getAllRides,
  updateRideStatus,
  viewEarningHistory

}









