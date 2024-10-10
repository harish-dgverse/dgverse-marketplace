/* eslint-disable import/prefer-default-export */
export const formatValidationErrors = (validationErrors: any) => {
  const formattedError: { required: string[]; number: string[]; format_regex: string[] } = {
    required: [],
    number: [],
    format_regex: [],
  };
  validationErrors.forEach(({ fieldName, validation }: { fieldName: string; validation: string }) => {
    switch (validation) {
      case 'required':
        formattedError.required.push(fieldName);
        break;
      case 'number':
        formattedError.number.push(fieldName);
        break;
      case 'format_regex':
        formattedError.format_regex.push(fieldName);
        break;
      default:
        break;
    }
  });
  return formattedError;
};
