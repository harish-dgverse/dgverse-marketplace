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
    fieldName: 'role',
    label: 'Role',
    validations: [
      {
        type: 'required',
      },
    ],
  },
  {
    fieldName: 'companyName',
    label: 'Company name',
    validations: [
      {
        type: 'required',
      },
    ],
  },
  {
    fieldName: 'source',
    label: 'Source of knowledge',
    validations: [
      {
        type: 'required',
      },
    ],
  },
];
