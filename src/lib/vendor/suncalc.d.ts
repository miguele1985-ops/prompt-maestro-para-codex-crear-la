declare const SunCalc: {
  getTimes(date: Date, latitude: number, longitude: number): {sunset: Date; sunrise: Date};
  getMoonIllumination(date: Date): {fraction: number; phase: number; angle: number};
};
export default SunCalc;
