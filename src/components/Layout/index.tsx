import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Grid, Container, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import Menu from '../Sidebar';
import PageDisplay from '../MainContent';

import styles from './style.module.css';

interface Page {
	title: string;
	bodyText: string;
}

interface Documentation {
	Pages: Page[];
}

const Layout: React.FC = () => {
	const [url, setUrl] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
	const [documentation, setDocumentation] = useState<Documentation | null>(
		null
	);
	const [errorMessage, setErrorMessage] = useState<string>('');

	const navigate = useNavigate();
	const { pageTitle } = useParams<{ pageTitle: string }>();

	const isValidUrl = (url: string) => {
		const urlPattern = new RegExp(
			'^(https?:\\/\\/)?' +
				'((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' +
				'((\\d{1,3}\\.){3}\\d{1,3}))' +
				'(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' +
				'(\\?[;&a-zA-Z\\d%_.~+=-]*)?' +
				'(\\#[-a-zA-Z\\d_]*)?$',
			'i'
		);
		return !!urlPattern.test(url);
	};

	useEffect(() => {
		const storedDocumentation = localStorage.getItem('documentation');
		if (storedDocumentation) {
			setDocumentation(JSON.parse(storedDocumentation));
		}
	}, []);

	useEffect(() => {
		if (!documentation) {
			return;
		}
		const pageExists = documentation.Pages.some(
			(page) => page.title === pageTitle
		);
		if (!pageExists && documentation.Pages.length > 0) {
			navigate(`/${documentation.Pages[0].title}`);
		}
	}, [documentation, pageTitle, navigate]);

	const handleFetchDocument = async () => {
		if (!isValidUrl(url)) {
			setErrorMessage('Please enter a valid URL.');
			return;
		}
		setIsLoadingSubmit(true);
		try {
			if (url) {
				const response = await fetch(url);
				const data: Documentation = await response.json();
				setDocumentation(data);
				localStorage.setItem('documentation', JSON.stringify(data));
				if (data.Pages.length > 0) {
					navigate(`/${data.Pages[0].title}`);
				}
			}
			setErrorMessage('');
		} catch (e: any) {
			setErrorMessage('Something went wrong');
		} finally {
			setIsLoadingSubmit(false);
		}
	};

	const saveChanges = (updatedPage: Page) => {
		if (documentation) {
			const updatedPages = documentation.Pages.map((p) =>
				p.title === pageTitle ? { ...p, ...updatedPage } : p
			);
			const updatedDocumentation = { Pages: updatedPages };
			setDocumentation(updatedDocumentation);
			localStorage.setItem(
				'documentation',
				JSON.stringify(updatedDocumentation)
			);
			navigate(`/${updatedPage.title}`);
		}
	};

	const exportDocumentation = () => {
		setIsLoading(true);
		if (documentation) {
			const dataStr =
				'data:text/json;charset=utf-8,' +
				encodeURIComponent(JSON.stringify(documentation));
			const downloadAnchorNode = document.createElement('a');
			downloadAnchorNode.setAttribute('href', dataStr);
			downloadAnchorNode.setAttribute('download', 'documentation.json');
			document.body.appendChild(downloadAnchorNode);
			downloadAnchorNode.click();
			downloadAnchorNode.remove();
		}
		setIsLoading(false);
	};

	const getCurrentPage = (): Page | undefined => {
		return documentation?.Pages.find((p) => p.title === pageTitle);
	};

	return (
		<div className="app">
			{documentation ? (
				<>
					<Box style={{ margin: '3vh', justifyContent: 'space-between' }}>
						<Grid container direction={'row'}>
							<Grid item md={3} lg={3} sm={12} xs={12}>
								<Menu pages={documentation.Pages} />
								<br />
								<LoadingButton
									onClick={exportDocumentation}
									variant="contained"
									startIcon={<FileDownloadIcon />}
									loading={isLoading}
								>
									Export
								</LoadingButton>
							</Grid>

							<Grid item md={8} lg={8} sm={12} xs={12}>
								{getCurrentPage() ? (
									<PageDisplay page={getCurrentPage()} onSave={saveChanges} />
								) : (
									<div>Page not found</div>
								)}
							</Grid>
						</Grid>
					</Box>
				</>
			) : (
				<Container className={styles.mainContainer}>
					<Box style={{ width: '100%' }}>
						<Grid
							container
							direction={'row'}
							justifyContent="center"
							alignItems="center"
							spacing={2}
						>
							<Grid item md={6} lg={6} sm={12} xs={12}>
								<TextField
									label="Enter URL"
									variant="outlined"
									fullWidth
									value={url}
									onChange={(e) => setUrl(e.target.value)}
									error={!!errorMessage}
									helperText={errorMessage}
								/>
							</Grid>
							<Grid item md={3} lg={3} sm={12} xs={12} textAlign={'center'}>
								<LoadingButton
									onClick={handleFetchDocument}
									variant="contained"
									endIcon={<SendIcon />}
									loading={isLoadingSubmit}
								>
									Submit
								</LoadingButton>
							</Grid>
						</Grid>
					</Box>
				</Container>
			)}
		</div>
	);
};

export default Layout;
