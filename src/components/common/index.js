// src/components/common/index.js
import ButtonComponent from './Button';
import InputComponent from './InputField';
import LoaderComponent from './Loader';

// Re-export as named exports
export const Button = ButtonComponent;
export const Input = InputComponent;
export const Loader = LoaderComponent;

// Also keep default exports for flexibility
export { ButtonComponent, InputComponent, LoaderComponent };