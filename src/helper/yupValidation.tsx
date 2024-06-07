import * as yup from 'yup';

export const validationSchema = (existingFileName: string[]) => {
	return yup.object({
		title: yup
			.string()
			.required('Title is required')
			.test('unique', 'Title must be unique', (value: string) =>
				value ? !existingFileName.includes(value) : true
			),
		bodyText: yup.string().required('Body is required'),
	});
};
