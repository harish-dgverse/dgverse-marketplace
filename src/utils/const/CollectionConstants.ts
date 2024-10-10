/* eslint-disable import/prefer-default-export */
export const basicPlanSteps = ['Collection type', 'Basic details', 'Royalty details', 'Additional details'];
export const silverPlusPlanSteps = [
  'Collection type',
  'Basic details',
  'Royalty details',
  'Immutability',
  'Freeze Capability',
  'KYC Status',
  'Pause Capability',
  'Wipe Capability',
  'Additional details',
];
export const sbtSteps = ['Collection type', 'Basic details', 'Additional details'];
export const fieldValidations = [
  {
    fieldName: 'name',
    label: 'Collection Name',
    validations: [
      {
        type: 'required',
      },
    ],
  },
  {
    fieldName: 'symbol',
    label: 'Symbol',
    validations: [
      {
        type: 'required',
      },
    ],
  },
  {
    fieldName: 'tokenCategory',
    label: 'Token Category',
    validations: [
      {
        type: 'required',
      },
    ],
  },
  {
    fieldName: 'description',
    label: 'Description',
    validations: [
      {
        type: 'required',
      },
    ],
  },
  {
    fieldName: 'royaltyPercent',
    label: 'Royalty Percent',
    validations: [
      {
        type: 'number',
      },
    ],
  },
  {
    fieldName: 'maxSupply',
    label: 'Max Supply',
    validations: [
      {
        type: 'number',
      },
    ],
  },
  {
    fieldName: 'displayPic',
    label: 'Display Picture',
    validations: [
      {
        type: 'image',
        imageState: 'displayPicAfterCrop',
      },
    ],
  },
];
