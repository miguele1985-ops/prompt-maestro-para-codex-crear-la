import { stepTwoCare } from './step-two-care';
import { stepTwoContinuity } from './step-two-continuity';
import { stepTwoAlerts } from './step-two-alerts';
export const stepTwoRevisions = { ...stepTwoCare, ...stepTwoContinuity, ...stepTwoAlerts };
