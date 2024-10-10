/* eslint-disable import/prefer-default-export */
export const fieldValidations = [
  {
    fieldName: 'name',
    label: 'Name',
    validations: [
      {
        type: 'required',
      },
    ],
  },
  {
    fieldName: 'email',
    label: 'Work Email',
    validations: [
      {
        type: 'required',
      },
      {
        type: 'email',
      },
    ],
  },
  {
    fieldName: 'comments',
    label: 'Comments',
    validations: [
      {
        type: 'required',
      },
    ],
  },
];
