import * as yup from 'yup';

export const validationSchema = yup.object({
	title: yup.string().required('Title is required'),
	bodyText: yup.string().required('Body is required'),
});
