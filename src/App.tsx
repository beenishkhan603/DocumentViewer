import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

const App: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />} />
				<Route path="/:pageTitle" element={<Layout />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
