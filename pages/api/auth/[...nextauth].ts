import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
	providers: [
		Providers.Credentials({
			name: 'Credentials',
			credentials: {
				email: { label: 'email', type: 'text' },
				password: { label: 'password', type: 'text' },
			},
			authorize: async (credentials: { email: string; password: string }) => {
				try {
					const emialQuery = `https://dev.tuten.cl:443/TutenREST/rest/user/${new URLSearchParams(
						credentials.email
					)}`;
					const url = emialQuery.substring(0, emialQuery.length - 1);
					console.log('url', url);

					const response = await fetch(url, {
						method: 'PUT',
						body: null,
						headers: {
							Accept: 'application/json',
							app: 'APP_BCK',
							password: credentials.password,
						},
					});
					// console.log('mirar response', response);
					const responseData = await response.json();
					// console.log('mirar responseData', responseData);
					if (responseData) {
						const finalData = {
							user: {
								email: responseData.email,
								firstName: responseData.firstName,
								lastName: responseData.lastName,
							},
							accessToken: responseData.sessionTokenBck,
						};
						return finalData;
					}
					return Promise.resolve(null);
				} catch (error) {
					console.log('---ERROR CREDENTIALS---', error);
					return Promise.resolve(null);
				}
			},
		}),
	],
	pages: {
		signIn: '/auth/signin',
	},
	callbacks: {
		session: async (session, token: any) => {
			session.user = token.user;
			session.accessToken = token.accessToken;
			// console.log('sesion on sesion', session);
			return session;
		},
		jwt: async (token, response) => {
			if (response) {
				token.user = response.user;
				token.accessToken = response.accessToken;
			}
			// console.log('jwt token', token);
			return token;
		},
	},
});
