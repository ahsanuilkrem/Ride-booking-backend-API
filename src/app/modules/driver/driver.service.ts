import AppError from "../../../errorHelpers/AppError";
import httpStatus from "http-status-codes"
import { IDriver } from "./driver.interfaces";
import { Driver } from "./driver.model";
import { QueryBuilder } from "../../../utils/QueryBuilder";
import { driverSchemaSearchableFields } from "./driver.constant";



const createDriver = async (payload: Partial<IDriver>) => {

  const { vehicleNumber, ...rest } = payload;

  const isUserExist = await Driver.findOne({ vehicleNumber })

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver Alrader Exist")
  }

  const driver = await Driver.create({
    vehicleNumber,
    ...rest
  })

  return driver
}


const updateStatus = async (driverId: string, payload: Partial<IDriver>) => {
  const drivers = await Driver.findById(driverId);
  if (!drivers) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }
  const newUpdateStatus = await Driver.findByIdAndUpdate(driverId, payload, { new: true, })

  return newUpdateStatus

}


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

const getDriverEarnings = async (driverId: string) => {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }
  return { earnings: driver.earnings };
}


export const driverService = {
  createDriver,
  updateStatus,
  getAllDriver,
  getDriverEarnings,

}