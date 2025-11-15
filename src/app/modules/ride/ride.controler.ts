/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsyncts";
import { sendResponse } from "../../../utils/sendRespone";
import { RideService } from "./ride.service";
import httpStatus from "http-status-codes"
import { JwtPayload } from 'jsonwebtoken';



const requestRide = catchAsync(async (req: Request, res: Response) => {
  const decodeToken = req.user as JwtPayload
  const ride = await RideService.requestRide(req.body, decodeToken.userId)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Ride requested successfully!",
    data: ride,
  });
});


const cancelRide = catchAsync(async (req: Request, res: Response) => {
 const riderId = req.user.user;
   const ride = await RideService.cancelRide(riderId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Ride cancelled successfully",
    data: ride,
  });
});


const getRideMyHistory = catchAsync(async (req: Request, res: Response) => {
  const query = req.query
  const decodedToken = req.user as JwtPayload;
  const result = await RideService.getRideMyHistory(decodedToken.userId, query as Record<string, string>);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Ride history fetched successfully",
    data:result.data,
    meta:result.meta
   
  });
});


const getAllRides = catchAsync(async (req: Request, res: Response) => {
  const rides = await RideService.getAllRides();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All rides fetched successfully",
    data: rides.data,
    meta: rides.meta
  });
});

const updateRideStatus = async (req: Request, res: Response) => {
    const { rideId } = req.params;
    const decodedToken = req.user as JwtPayload;
    const { rideStatus } = req.body;
   const result = await RideService.updateRideStatus(
    decodedToken.userId,
    rideId,
    rideStatus
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Ride status updated successfully",
    data: result,
  });
};

const viewEarningHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await RideService.viewEarningHistory(decodedToken.userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Driver Earning History has been retrieve successfully",
      data: result,
    });
  }
);



export const rideControler = {

  requestRide,
  cancelRide,
  getRideMyHistory,
  getAllRides,
  updateRideStatus,
  viewEarningHistory,

}


