import * as React from 'react';
import { Images, ImagesType } from 'interfaces';

export const LayoutAuth: React.FC = ({ children }) => {
	const background = {
		backgroundImage: `url('${Images.circuit}')`,
	} as React.CSSProperties;

	return (
		<div
			className=" min-h-screen bg-secondary flex items-center justify-center py-6"
			style={background}
		>
			<div className="flex max-w-sm m-auto overflow-hidden rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-lg w-full">
				<div className="w-full px-6 py-8 md:px-8  bg-white">{children}</div>
			</div>
		</div>
	);
};
