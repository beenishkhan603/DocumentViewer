import React from 'react';
import { Divider, List, ListItemButton, ListItemText } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import styles from './style.module.css';

interface MenuProps {
	pages: { title: string }[];
}

const Menu: React.FC<MenuProps> = ({ pages }) => {
	const location = useLocation();

	return (
		<div className={styles.menu}>
			<List component="nav">
				{pages?.map((page: { title: string }) => (
					<div key={page.title}>
						<ListItemButton
							component={Link}
							to={`/${page.title}`}
							selected={location.pathname === encodeURI(`/${page.title}`)}
						>
							<ListItemText
								primary={
									page?.title?.length > 50
										? page.title.substring(0, 50) + '...'
										: page.title
								}
							/>
						</ListItemButton>
						<Divider />
					</div>
				))}
			</List>
		</div>
	);
};

export default Menu;
