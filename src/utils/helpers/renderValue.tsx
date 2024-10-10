const renderValue = (value: string | number | undefined, message?: string) => value || <span>{message || '(empty)'}</span>;

export default renderValue;
