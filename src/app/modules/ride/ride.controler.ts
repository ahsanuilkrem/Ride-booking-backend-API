import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsyncts";
import { sendResponse } from "../../../utils/sendRespone";
import { RideService } from "./ride.service";
import httpStatus from "http-status-codes"



const requestRide = catchAsync(async (req: Request, res: Response) => {
  const riderId = req.user.userId; 
  const { pickupLocation, destinationLocation } = req.body;

  const ride = await RideService.requestRide({
    rider: riderId,
    pickupLocation,
    destinationLocation,
    status: "requested",
    timestamps: {
      requestedAt: new Date(),
    },
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Ride requested successfully!",
    data: ride,
  });
});


const cancelRide = catchAsync(async (req: Request, res: Response) => {
  const riderId = req.user.userId;
  const rideId = req.params.id;

  const ride = await RideService.cancelRide(rideId, riderId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Ride cancelled successfully",
    data: ride,
  });
});

const getRideMyHistory = catchAsync( async (req: Request, res: Response) => {
    const riderId = req.user.userId;

    const result = await RideService.getRideMyHistory(riderId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ride history fetched successfully!",
      data: result,
    });
  }
);


const getAllRides = catchAsync(async (req: Request, res: Response) => {
  const rides = await RideService.getAllRides();
  sendResponse(res, {
    statusCode:httpStatus.OK,
    success: true,
    message: "All rides fetched successfully",
    data: rides.data,
    meta :rides.meta
  });
});

const updateRideStatus = async (req: Request, res: Response) => {
  const rideId = req.params.id;
  const { status } = req.body;

  const result = await RideService.updateRideStatus(rideId, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Ride status updated successfully",
    data: result,
  });
};

export const rideControler = {

    requestRide,
    cancelRide,
    getRideMyHistory,
    getAllRides,
    updateRideStatus

}


