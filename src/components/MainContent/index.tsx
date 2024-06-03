import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import MarkdownIt from 'markdown-it';
import { TextField, Button, Grid, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

import { validationSchema } from '../../helper/yupValidation';
import styles from './style.module.css';

interface Page {
	title: string;
	bodyText: string;
}

interface MainAreaProps {
	page?: Page;
	onSave?: (page: Page) => void;
}

const MainArea: React.FC<MainAreaProps> = ({ page, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			title: page?.title || '',
			bodyText: page?.bodyText || '',
		},
	});

	useEffect(() => {
		if (page) {
			setValue('title', page.title);
			setValue('bodyText', page.bodyText);
		}
	}, [page, setValue]);

	const onSubmit = (data: { title: string; bodyText: string }) => {
		if (onSave && page) {
			onSave(data);
		}
		setIsEditing(false);
	};

	if (!page) {
		return <div>No page selected</div>;
	}

	return (
		<div className="page-display">
			{isEditing ? (
				<form onSubmit={handleSubmit(onSubmit)}>
					<Controller
						name="title"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Title"
								variant="outlined"
								fullWidth
								error={!!errors.title}
								helperText={errors.title ? errors.title.message : ''}
							/>
						)}
					/>
					<br />
					<br />
					<Controller
						name="bodyText"
						control={control}
						render={({ field }) => (
							<>
								<MdEditor
									value={field.value}
									style={{ height: '400px' }}
									renderHTML={(text) => new MarkdownIt().render(text)}
									onChange={({ text }) => field.onChange(text)}
								/>
								{errors.bodyText && (
									<p style={{ color: 'red' }}>{errors.bodyText.message}</p>
								)}
							</>
						)}
					/>
					<br />
					<Button type="submit" variant="contained" color="primary">
						Complete Edit
					</Button>
				</form>
			) : (
				<Box className={styles.mainContainer}>
					<Grid container direction={'row'} className={styles.titleContainer}>
						<Grid item md={10} lg={10} sm={12} xs={12}>
							<h1>{page.title}</h1>
						</Grid>
						<Grid item md={2} lg={2} sm={12} xs={12}>
							<Button variant="contained" onClick={() => setIsEditing(true)}>
								Edit
							</Button>
						</Grid>
					</Grid>
					<ReactMarkdown>{page.bodyText}</ReactMarkdown>
				</Box>
			)}
		</div>
	);
};

export default MainArea;
