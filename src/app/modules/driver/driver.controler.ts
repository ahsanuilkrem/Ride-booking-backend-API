import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsyncts";
import { sendResponse } from "../../../utils/sendRespone";
import { driverService } from "./driver.service";


const createDriver = catchAsync(async (req: Request, res: Response) => {
  const result = await driverService.createDriver(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Driver created",
    data: result,
  });
});

const updateStatus = catchAsync(async (req: Request, res: Response) => {

  const driverId = req.params.id;
  const result = await driverService.updateStatus(driverId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Driver status Availability",
    data: result,
  });
})

const getAllDriver = catchAsync(async (req: Request, res: Response) => {
  const query = req.query
  const result = await driverService.getAllDriver(query as Record<string, string>);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Driver All fetched successfully",
    data: result,
  });
})


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
  updateStatus,
  getAllDriver,
  getEarnings,

}


