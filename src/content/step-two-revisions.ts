import { stepTwoCare } from './step-two-care';
import { stepTwoContinuity } from './step-two-continuity';
import { stepTwoAlerts } from './step-two-alerts';
import { stepTwoCommunication } from './step-two-communication';
import { stepTwoEquipment } from './step-two-equipment';
import { stepTwoNature } from './step-two-nature';
export const stepTwoRevisions = { ...stepTwoCare, ...stepTwoContinuity, ...stepTwoAlerts, ...stepTwoCommunication, ...stepTwoEquipment, ...stepTwoNature };
