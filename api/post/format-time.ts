import { ApiDate } from 'interfaces';

export const formatTime = async (fomrat: ApiDate) => {
	const data = await fetch(`/api/format-time`, {
		method: 'POST',
		body: JSON.stringify(fomrat),
	});
	return data;
};
