import { Book } from 'interfaces';

export const getDataBooks = async (token: string): Promise<Book[]> => {
	console.log({ token });

	const data = await fetch(
		`https://dev.tuten.cl:443/TutenREST/rest/user/contacto%40tuten.cl/bookings?current=true`,
		{
			method: 'GET',
			headers: {
				Accept: 'application/json',
				app: 'APP_BCK',
				token: token,
				adminemail: 'testapis@tuten.cl',
			},
		}
	);
	const responseData = await data.json();
	console.log({ responseData });

	return responseData;
};
