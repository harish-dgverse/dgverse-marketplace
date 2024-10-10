import pick from 'lodash/pick';
import transformToFees from './transformToFees';
import { FEE, Fees } from '../entity/Fees';

const prepareFees = (customFees: Fees[], accountId: string) => {
  const filteredFees = customFees.map((fee) => {
    switch (fee.type) {
      case FEE.FIXED:
        return {
          ...pick(fee, ['amount', 'type']),
          accountId,
        };

      case FEE.ROYALTY:
        return {
          numerator: fee.percent,
          denominator: 100,
          ...pick(fee, ['feeCollectorAccountId', 'fallbackFee', 'type']),
        };
      default:
        return {
          ...pick(fee, ['amount', 'type']),
          accountId,
        };
    }
  });

  return transformToFees(filteredFees);
};

export default prepareFees;
