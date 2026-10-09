import '@/utils/yup-extension-utils';
import { capitalize } from 'lodash';
import { InferType, mixed, object, ref, string } from 'yup';

export const passwordStrength = string()
  .test('password-length', 'Password must contain at least 6 characters', (value) => {
    if (!value) {
      return true;
    }
    return value.length >= 6;
  })
  .test('password-uppercase', 'Password must contain at least 1 uppercase character', (value) => {
    if (!value) {
      return true;
    }
    return /[A-Z]/.test(value);
  })
  .test('password-lowercase', 'Password must contain at least 1 lowercase character', (value) => {
    if (!value) {
      return true;
    }
    return /[a-z]/.test(value);
  })
  .test('password-digit', 'Password must contain at least 1 lowercase character', (value) => {
    if (!value) {
      return true;
    }
    return /\d/.test(value);
  })
  .test('password-special', 'Password must contain at least 1 special character', (value) => {
    if (!value) {
      return true;
    }
    return /[!@#$%^&*(),.?":{}|<>]/.test(value);
  });

export const getSignupSchema = (mode: 'create' | 'edit' = 'create') => {
  const signupSchema = object({
    name: string()
      .required('Name is required')
      .min(2, 'Name must contain minimum 2 characters')
      .transform((value) =>
        typeof value === 'string' && value.length > 0 ? capitalize(value) : value,
      ),

    profilePicture: mixed<string | File>().optional(),

    address: string().required('Address is required'),
    email: string().email('Invalid email format').required('Email is required'),
    phoneNumber: string()
      .matches(/^\+?\d{10,15}$/, 'Please enter a valid phone number')
      .required('Phone number is required'),

    password: passwordStrength.required('Password is required'),
    confirmPassword: string()
      .required('Confirm password is required')
      .oneOf([ref('password')], 'Passwords must match'),
  });

  if (mode === 'edit') {
    return signupSchema.shape({
      password: string().optional(),
      confirmPassword: string().optional(),
    });
  }

  return signupSchema;
};

export const createSchema = getSignupSchema('create');
export type ISignupFormValues = InferType<typeof createSchema>;
