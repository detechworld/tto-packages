import { createEnum } from '@detechworld/toolbox';

const AWARD_STATUS = createEnum({
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3
});

const AWARD_RECIPIENT_STATUS = createEnum({
  UNCONFIRMED: 1,
  CONFIRMED: 2,
  CANCELED: 3
})

const AWARD_WITHDRAWAL_REQUEST_STATUS = createEnum({
  PENDING: 1,
  CERTIFIED: 2,
  APPROVED: 3,
  PAID: 4,
  REJECTED: 5
});

export {
  AWARD_STATUS,
  AWARD_RECIPIENT_STATUS,
  AWARD_WITHDRAWAL_REQUEST_STATUS
};
