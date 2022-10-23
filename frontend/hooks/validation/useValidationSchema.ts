import * as yup from 'yup';
import { emailRegex, passwordRegex } from '../../utils';

export default function useValidationSchema() {
  return {
    //#region modify account
    modifyAccountSchema: yup.object().shape({
      current_password: yup.string().required('Password is required.'),
      new_password: yup
        .string()
        .required('Please create a password.')
        .min(8, 'Password needs to be at least 8 characters long.')
        .max(16, 'Password must be at most 16 charaters.')
        .matches(passwordRegex, 'Password must Contain One Uppercase, One Lowercase, One Number and one Special case Character.'),
      new_confirm_password: yup
        .string()
        .required('Please confirm your password.')
        .oneOf([yup.ref('new_password')], 'Passwords do not match.'),
    }),
    //#endregion

    //#region fill information for first login schema
    firstLoginSchema: yup.object().shape({
      firstName: yup
        .string()
        .required('First name is required.')
        .min(3, 'First name needs to be at least 3 characters long.')
        .max(8, 'First name must be at most 8 charaters.'),
      lastName: yup
        .string()
        .required('Last name is required.')
        .min(3, 'Last name needs to be at least 3 characters long.')
        .max(16, 'Last name must be at most 16 charaters.'),
      gender: yup.string(),
      phone: yup.string().required('Phone number is required.'),
      country: yup.string().required('Country is required.'),
      city: yup.string().required('City is required.'),
      district: yup.string(),
      village: yup.string(),
    }),
    //#endregion

    //#region forgot-password set new schema
    forgotPasswordSetNewSchema: yup.object().shape({
      email: yup.string().required('Email is required.').email('Valid characters in email addresses.').matches(emailRegex),
      code: yup.string().required('Code is required.'),
      password: yup
        .string()
        .required('Please create a password.')
        .min(8, 'Password needs to be at least 8 characters long.')
        .max(16, 'Password must be at most 16 charaters.')
        .matches(passwordRegex, 'Password must Contain One Uppercase, One Lowercase, One Number and one Special case Character.'),
      confirm_password: yup
        .string()
        .required('Please confirm your password.')
        .oneOf([yup.ref('password')], 'Passwords do not match.'),
    }),
    //#endregion

    //#region forgot-password schema
    forgotPasswordSchema: yup.object().shape({
      email: yup.string().required('Email is required.').email('Valid characters in email addresses.').matches(emailRegex),
    }),
    //#endregion

    //#region register schema
    registerSchema: yup.object().shape({
      email: yup
        .string()
        .email('Valid characters in email addresses.')
        .required('Please enter an email address.')
        .matches(emailRegex),
      password: yup
        .string()
        .required('Please create a password.')
        .min(8, 'Password needs to be at least 8 characters long.')
        .max(16, 'Password must be at most 16 charaters.')
        .matches(passwordRegex, 'Password must Contain One Uppercase, One Lowercase, One Number and one Special case Character.'),
      confirm_password: yup
        .string()
        .required('Please confirm your password.')
        .oneOf([yup.ref('password')], 'Passwords do not match.'),
    }),
    //#endregion

    //#region login schema
    loginSchema: yup.object().shape({
      email: yup.string().required('Email is required.').email('Valid characters in email addresses.').matches(emailRegex),
      password: yup.string().required('Password is required.'),
    }),
    //#endregion
  };
}
