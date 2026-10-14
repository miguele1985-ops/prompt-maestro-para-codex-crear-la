import { stepTwoCare } from './step-two-care';
import { stepTwoContinuity } from './step-two-continuity';
import { stepTwoAlerts } from './step-two-alerts';
import { stepTwoCommunication } from './step-two-communication';
export const stepTwoRevisions = { ...stepTwoCare, ...stepTwoContinuity, ...stepTwoAlerts, ...stepTwoCommunication };
