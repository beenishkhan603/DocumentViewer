import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PageDisplay from './components/MainContent';

const App: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route path=":pageTitle" element={<PageDisplay />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
