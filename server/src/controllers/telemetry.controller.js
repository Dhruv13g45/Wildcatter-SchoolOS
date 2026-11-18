import { inMemoryStore } from '../config/database.js';
import { SecurityRouteDispatcherAgent } from '../services/agents/securityRouteDispatcher.js';

/**
 * Function-based Bus Telemetry Controller (PRD Section 4)
 */

export const getFleetTelemetry = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'SUCCESS',
      count: inMemoryStore.busTelemetry.length,
      buses: inMemoryStore.busTelemetry,
    });
  } catch (err) {
    next(err);
  }
};

export const registerBus = async (req, res, next) => {
  try {
    const { bus_id, route_name, driver_name, driver_phone, current_stop, next_stop } = req.body;

    const id = bus_id || `BUS-${Math.floor(10 + Math.random() * 90)}`;
    const newBus = {
      bus_id: id,
      route_name: route_name || 'Main Route',
      driver_name: driver_name || 'Designated Driver',
      driver_phone: driver_phone || '+919876500000',
      latitude: 28.6280,
      longitude: 77.3649,
      altitude_meters: 216.5,
      speed_kmh: 35.0,
      traffic_delay_minutes: 0,
      proximity_alert_sent: false,
      current_stop: current_stop || 'Main School Gate',
      next_stop: next_stop || 'Stop 1',
      eta_minutes: 10,
      last_updated: new Date(),
    };

    inMemoryStore.busTelemetry.push(newBus);

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Bus transit node registered in telemetry stream.',
      bus: newBus,
    });
  } catch (err) {
    next(err);
  }
};

export const pushTelemetryUpdate = async (req, res, next) => {
  try {
    const result = await SecurityRouteDispatcherAgent.evaluateTelemetryStream(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
