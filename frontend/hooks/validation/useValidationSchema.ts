import * as yup from 'yup';
import { emailRegex, passwordRegex } from '../../utils';

export default function useValidationSchema() {
  return {
    //#region forgot-password set new schema
    forgotPasswordSetNewSchema: yup.object().shape({
      email: yup.string().required('Email is required.').email('Valid characters in email addresses.').matches(emailRegex),
      code: yup.string().required('Code is required.'),
      password: yup
        .string()
        .required('Please create a password.')
        .min(8, 'Password needs to be at least 8 characters long.')
        .max(16, 'Password must be at most 16 charaters.')
        .matches(
          passwordRegex,
          '⚠ Password must Contain One Uppercase, One Lowercase, One Number and one Special case Character.'
        ),
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
        .matches(
          passwordRegex,
          '⚠ Password must Contain One Uppercase, One Lowercase, One Number and one Special case Character.'
        ),
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
