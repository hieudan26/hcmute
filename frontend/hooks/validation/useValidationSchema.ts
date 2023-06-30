import * as yup from 'yup';
import { emailRegex, passwordRegex } from '../../utils';

export default function useValidationSchema() {
  return {
    //#region create trip
    createItinerarySchema: yup.object().shape({
      title: yup.string().required('Không được để trống'),
      maxDay: yup.number().required('Không được để trống'),
      maxMember: yup.number().required('Không được để trống'),
      totalPrice: yup.number().required('Không được để trống'),
      description: yup.string(),
    }),
    //#endregion

    //#region create country&province
    createProvinceSchema: yup.object().shape({
      country: yup.number().required('Không được để trống'),
      vnName: yup
        .string()
        .required('Không được để trống')
        .min(3, 'Tên tiếng Việt cần dài ít nhất 3 ký tự')
        .max(12, 'Tên tiếng Việt tối đa 12 ký tự'),
      enName: yup
        .string()
        .required('Không được để trống')
        .min(3, 'Tên tiếng Anh cần dài ít nhất 3 ký tự')
        .max(12, 'Tên tiếng Anh tối đa 12 ký tự'),
    }),

    createCountrySchema: yup.object().shape({
      vnName: yup
        .string()
        .required('Không được để trống')
        .min(3, 'Tên tiếng Việt cần dài ít nhất 3 ký tự')
        .max(12, 'Tên tiếng Việt tối đa 12 ký tự'),
      enName: yup
        .string()
        .required('Không được để trống')
        .min(3, 'Tên tiếng Anh cần dài ít nhất 3 ký tự')
        .max(12, 'Tên tiếng Anh phải dài tối đa 12 ký tự'),
    }),
    //#endregion

    //#region create category
    createCategorySchema: yup.object().shape({
      name: yup
        .string()
        .required('Không được để trống')
        .min(3, 'Tên danh mục cần dài ít nhất 3 ký tự')
        .max(12, 'Tên danh mục phải dài tối đa 12 ký tự'),
    }),
    //#endregion

    //#region infor-admin
    inforAdminSchema: yup.object().shape({
      firstName: yup
        .string()
        .required('Không được để trống')
        .min(3, 'Tên phải dài ít nhất 3 ký tự')
        .max(8, 'Tên phải có nhiều nhất 8 ký tự'),
      lastName: yup
        .string()
        .required('Không được để trống')
        .min(3, 'Họ cần dài ít nhất 3 ký tự.')
        .max(16, 'Họ phải có nhiều nhất 16 ký tự'),
      gender: yup.string(),
      phoneNumber: yup.string().required('Không được để trống'),
    }),
    //#endregion

    //#region account-manager
    accountManagementSchema: yup.object().shape({
      email: yup.string().email('Địa chỉ mail không phù hợp').required('Không được để trống').matches(emailRegex),
      password: yup
        .string()
        .required('Không được để trống')
        .min(8, 'Mật khẩu cần dài ít nhất 8 ký tự')
        .max(16, 'Mật khẩu phải có nhiều nhất 16 ký tự')
        .matches(passwordRegex, 'Mật khẩu phải chứa một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.'),
      confirm_password: yup
        .string()
        .required('Không được để trống')
        .oneOf([yup.ref('password')], 'Mật khẩu không trùng khớp.'),
      role: yup.string().required('Không được để trống'),
      firstName: yup
        .string()
        .required('Không được để trống')
        .min(3, 'Tên phải dài ít nhất 3 ký tự')
        .max(8, 'Tên phải có nhiều nhất 8 ký tự.'),
      lastName: yup
        .string()
        .required('Không được để trống')
        .min(3, 'Họ cần dài ít nhất 3 ký tự')
        .max(16, 'Họ phải có nhiều nhất 16 ký tự'),
      gender: yup.string(),
      phoneNumber: yup.string().required('Không được để trống'),
    }),
    //#endregion

    //#region modify account
    modifyAccountSchema: yup.object().shape({
      current_password: yup.string().required('Không được để trống'),
      new_password: yup
        .string()
        .required('Không được để trống')
        .min(8, 'Mật khẩu cần dài ít nhất 8 ký tự')
        .max(16, 'Mật khẩu phải có nhiều nhất 16 ký tự')
        .matches(passwordRegex, 'Mật khẩu phải chứa một chữ hoa, một chữ thường, một số và một ký tự trường hợp đặc biệt'),
      new_confirm_password: yup
        .string()
        .required('Không được để trống')
        .oneOf([yup.ref('new_password')], 'Mật khẩu không trùng khớp'),
    }),
    //#endregion

    //#region fill information for first login schema
    firstLoginSchema: yup.object().shape({
      firstName: yup
        .string()
        .required('Không được để trống')
        .min(3, 'Tên phải dài ít nhất 3 ký tự')
        .max(8, 'Tên phải có nhiều nhất 8 ký tự'),
      lastName: yup
        .string()
        .required('Không được để trống')
        .min(3, 'Họ cần dài ít nhất 3 ký tự')
        .max(16, 'Họ phải có nhiều nhất 16 ký tự'),
      gender: yup.string(),
      phoneNumber: yup.string().required('Không được để trống'),
      country: yup.string().required('Không được để trống'),
      city: yup.string().required('Không được để trống'),
      district: yup.string(),
      village: yup.string(),
    }),
    //#endregion

    //#region forgot-password set new schema
    forgotPasswordSetNewSchema: yup.object().shape({
      email: yup.string().required('Không được để trống').email('Địa chỉ mail không hợp lệ').matches(emailRegex),
      code: yup.string().required('Không được để trống'),
      password: yup
        .string()
        .required('Không được để trống')
        .min(8, 'Mật khẩu cần dài ít nhất 8 ký tự')
        .max(16, 'Mật khẩu phải có nhiều nhất 16 ký tự')
        .matches(passwordRegex, 'Mật khẩu phải chứa một chữ hoa, một chữ thường, một số và một ký tự đặc biệt'),
      confirm_password: yup
        .string()
        .required('Không được để trống')
        .oneOf([yup.ref('password')], 'Không được để trống'),
    }),
    //#endregion

    //#region forgot-password schema
    forgotPasswordSchema: yup.object().shape({
      email: yup.string().required('Không được để trống').email('Địa chỉ mail không hợp lệ').matches(emailRegex),
    }),
    //#endregion

    //#region register schema
    registerSchema: yup.object().shape({
      email: yup.string().required('Không được để trống').email('Địa chỉ mail không hợp lệ').matches(emailRegex),
      password: yup
        .string()
        .required('Không được để trống')
        .min(8, 'Mật khẩu cần dài ít nhất 8 ký tự')
        .max(16, 'Mật khẩu phải có nhiều nhất 16 ký tự')
        .matches(passwordRegex, 'Mật khẩu phải chứa một chữ hoa, một chữ thường, một số và một ký tự trường hợp đặc biệt'),
      confirm_password: yup
        .string()
        .required('Không được để trống')
        .oneOf([yup.ref('password')], 'Mật khẩu không khớp'),
    }),
    //#endregion

    //#region login schema
    loginSchema: yup.object().shape({
      email: yup.string().required('Không được để trống').email('Địa chỉ mail không hợp lệ').matches(emailRegex),
      password: yup.string().required('Không được để trống'),
    }),
    //#endregion
  };
}
