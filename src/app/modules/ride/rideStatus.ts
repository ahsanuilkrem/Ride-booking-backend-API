import { RideStatus } from "./ride.interfaces";


export const ACTIVE_RIDE_STATUSES = [
  RideStatus.cancelled_by_driver,
  RideStatus.accepted,
  RideStatus.picked_up,
  RideStatus.in_transit,
];

export const rideStatusFlow : Record<RideStatus, RideStatus[]> = {
    [RideStatus.requested]: [RideStatus.accepted, RideStatus.cancelled_by_driver],
    [RideStatus.accepted]: [RideStatus.picked_up],
    [RideStatus.picked_up]: [RideStatus.in_transit],
    [RideStatus.in_transit]: [RideStatus.completed],
    [RideStatus.completed]: [],
    [RideStatus.cancelled_by_driver]: [],
    [RideStatus.cancelled_by_rider]: [],
    [RideStatus.no_driver_available]: []
};

export const getFullRideStatusFlow = (): string => {
  const flow: string[] = [];
  let current: RideStatus | undefined = RideStatus.requested;

  const visited = new Set<string>();

  while (current && !visited.has(current)) {
    flow.push(current);
    visited.add(current);
    current = rideStatusFlow[current]?.[0]; // Only follow the primary path
  }

  return flow.join(" → ");
};