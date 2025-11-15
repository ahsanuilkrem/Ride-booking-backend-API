/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsyncts";
import { sendResponse } from "../../../utils/sendRespone";
import { driverService } from "./driver.service";
import { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { UpdateMyDriverProfile } from "./driver.interfaces";


const createDriver = catchAsync(async (req: Request, res: Response) => {
   const decodeToken = req.user as JwtPayload
  const result = await driverService.createDriver(req.body, decodeToken.userId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Driver created",
    data: result,
  });
});

const getAllDriver = catchAsync(async (req: Request, res: Response) => {

  const query = req.query
  const result = await driverService.getAllDriver(query as Record<string, string>);
  
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Driver All fetched successfully",
    data: result.data,
    meta: result.meta
  });
})

const updateDriverStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { driverId } = req.params;
    const { driverStatus} = req.body; 
    // console.log("driverId", req.params)
    const result = await driverService.updateDriverStatus(driverId, driverStatus);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Driver status updated to ${driverStatus}`,
      data: result,
    });
  }
);

const updateMyDriverProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const payload = req.body as UpdateMyDriverProfile;

    const result = await driverService.updateMyDriverProfile(user, payload);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Driver profile updated successfully",
      data: result,
    });
  }
);

const getMyDriverProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;

    const result = await driverService.getMyDriverProfile(user);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Driver profile fetched successfully",
      data: result,
    });
  }
);

 const toggleAvailability = catchAsync(async (req: Request, res: Response) => {
  
  const driverId = req.params.id;
  const { availability } = req.body;

  const result = await driverService.toggleAvailability(driverId, { availability });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Availability status updated successfully",
    data: result,
  });
});

const updateAvailability = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const { availability } = req.body;

    const result = await driverService.updateAvailability(user, availability);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Driver availability updated successfully",
      data: result,
    });
  }
);


const getDriverRideHistory = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const query = req.query as Record<string, string>;
  
    const result = await driverService.getDriverRideHistory(user, query);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Driver ride history fetched successfully",
      data: result,
    });
  }
);

const getEarnings = catchAsync(async (req: Request, res: Response) => {

  const result = await driverService.getDriverEarnings(req.params.id );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Driver All earning successfully",
    data: result,
  });

});



export const DriverControler = {
  createDriver,
  updateDriverStatus,
  getAllDriver,
  updateMyDriverProfile,
  getMyDriverProfile,
  getDriverRideHistory,
  // updateStatus,
  toggleAvailability,
  updateAvailability,
  getEarnings,

}


