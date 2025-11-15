/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../../errorHelpers/AppError";
import httpStatus from "http-status-codes"
import { availaStatus, IDriver, IsStatus, UpdateMyDriverProfile } from "./driver.interfaces";
import { Driver } from "./driver.model";
import { QueryBuilder } from "../../../utils/QueryBuilder";
import { driverSchemaSearchableFields } from "./driver.constant";
import { User } from "../user/user.model";
import { Role } from "../user/user.interfaces";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { Ride } from "../ride/ride.model";




const createDriver = async (payload: Partial<IDriver>, userId: string) => {

  try {
    const user = await User.findById(userId)
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    // if (!user?.phone || !user?.address) {
    //       throw new AppError(httpStatus.BAD_REQUEST, "Please Update Your My Profile ")
          
    //     }

    const { vehicleNumber, ...rest } = payload;
    const isDriverExist = await Driver.findOne({ vehicleNumber })
    if (isDriverExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "Driver Alrader Exist")
    }

    const isUserExist = await Driver.findOne({ userId: userId  })

    if (isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "userId alrader Exist")
    }

    const driver = await Driver.create({
      userId: userId,
      vehicleNumber,
      ...rest
    })

    const updateUserRole = await User.findByIdAndUpdate(
      userId,
      { role: Role.DRIVER },
      { new: true, runValidators: true, }
    )


    return {
      driver,
      updateUserRole
    }

  } catch (error) {
    console.error(error)
  }

}


 const toggleAvailability = async ( driverId: string, payload: { availability: availaStatus }) => {

  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }

  if (!Object.values(availaStatus).includes(payload.availability)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid availability status");
  }

  const updatedDriver = await Driver.findByIdAndUpdate(driverId, payload, {
    new: true,
  });

  return updatedDriver;
};



const updateAvailability = async ( user: JwtPayload, availability: availaStatus) => {

  if (![
     availaStatus.AVAILABLE,
     availaStatus.UNAVAILABLE
    ].includes(availability)
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid availability change");
  }

  const driver = await Driver.findOne({ userId: user.userId });

  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }

  // if (driver.status !== IsStatus.APPROVED) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     "Only approved drivers can update availability"
  //   );
  // }

  driver.availability = availability;
  await driver.save();

  return driver;
};

const updateMyDriverProfile = async (
  user: JwtPayload,
  payload: UpdateMyDriverProfile
) => {
  const driver = await Driver.findOne({ userId: user.userId });

  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver profile not found");
  }

  if (payload.vehicleType) driver.vehicleType = payload.vehicleType;
  if (payload.vehicleModel) driver.vehicleModel = payload.vehicleModel;
  if (payload.vehicleNumber) driver.vehicleNumber = payload.vehicleNumber;
  if (payload.licenseNumber) driver.licenseNumber = payload.licenseNumber;

  // if (payload.availability) {
  //   if (!Object.values(availaStatus.AVAILABLE).includes(payload.availability)) {
  //     throw new AppError(httpStatus.BAD_REQUEST, "Invalid availability value");
  //   }
  //   driver.availability = payload.availability;
  // }

  if (payload.availability !== undefined) {
  if (!Object.values(availaStatus).includes(payload.availability)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid availability value");
  }
  driver.availability = payload.availability;
}

  await driver.save();
  return driver;
};

const getMyDriverProfile = async (user: JwtPayload) => {
  const driver = await Driver.findOne({ userId: user.userId }).populate(
    "userId"
  );

  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver profile not found");
  }

  return driver;
};



const updateDriverStatus = async (driverId: string, driverStatus: IsStatus) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const driver = await Driver.findById(driverId).session(session);
    if (!driver) {
      throw new AppError(httpStatus.NOT_FOUND, "Driver application not found");
    }

    if (driver.status === driverStatus) {
      throw new AppError(httpStatus.BAD_REQUEST, `Already ${driverStatus}`);
    }

    driver.status = driverStatus;

    if (driverStatus === IsStatus.APPROVED) {
      driver.approvedAt = new Date();

      // ✅ Update the user's role to DRIVER
      await User.findByIdAndUpdate(
        driver.userId,
        { role: Role.DRIVER },
        { session }
      );
    }

    await driver.save({ session });

    await session.commitTransaction();
    session.endSession();

    return driver;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllDriver = async (query: Record<string, string>) => {

  const queryBuilder = new QueryBuilder(Driver.find(), query)

  const driver = await queryBuilder
    .search(driverSchemaSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()

  const [data, meta] = await Promise.all([
    driver.build(),
    queryBuilder.getMeta()
  ])

  return {
    data,
    meta
  }

}

const getDriverRideHistory = async (
  user: JwtPayload,
  query: Record<string, string>
) => {
  // First verify the driver exists and is approved
  const driver = await Driver.findOne({ userId: user.userId });

  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver profile not found");
  }

  if (driver.status !== IsStatus.APPROVED) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only approved drivers can view ride history"
    );
  }

  // Create base query for rides where this driver was assigned
  const baseQuery : Record<string, any>= { driver: driver._id };

  // Apply search filter if searchTerm is provided
  let searchQuery: Record<string, any>  = { ...baseQuery };
  if (query.searchTerm) {
    searchQuery = {
      ...baseQuery,
      $or: [
        { "pickupAddress": { $regex: query.searchTerm, $options: "i" } },
        {
          "destinationAddress": {
            $regex: query.searchTerm,
            $options: "i",
          },
        },
        { status: { $regex: query.searchTerm, $options: "i" } },
      ],
    } as any;
  }

  // Apply additional filters from query parameters
  const filterQuery = { ...searchQuery };
  if (query.status) {
    filterQuery.status = query.status;
  }
  if (query.vehicleType) {
    filterQuery.vehicleType = query.vehicleType;
  }

  // Create query builder for rides where this driver was assigned
  const rideQuery = Ride.find(filterQuery)
    .populate("userId", "name email phone")
    .sort({ createdAt: -1 });

  const queryBuilder = new QueryBuilder(rideQuery, query);

  // Apply search, filter, sort, and pagination
  const result = await queryBuilder
    .search(["pickupAddress", "destinationAddress", "status"])
    .filter()
    .sort()
    .fields()
    .paginate();

   
  // Get total count for the specific driver's rides with applied filters
  const totalDocuments = await Ride.countDocuments(filterQuery);

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 5;
  const totalPage = Math.ceil(totalDocuments / limit);

  const meta = {
    page,
    limit,
    total: totalDocuments,
    totalPage,
  };

  const data = await result.build();

  return {
    data,
    meta,
  };
};

const getDriverEarnings = async (driverId: string) => {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }
  return { earnings: driver.earnings };
}


export const driverService = {
  createDriver,
  toggleAvailability,
  updateAvailability,
  updateMyDriverProfile,
  getMyDriverProfile,
  getDriverEarnings,
  getAllDriver,
  getDriverRideHistory,
  updateDriverStatus,

}