import { useSession } from 'next-auth/client';
import { UserType } from 'interfaces';

export const useUser = () => {
	const [session] = useSession();
	const user = session?.user ? (session.user as UserType) : undefined;
	const token = session?.accessToken ? (session?.accessToken as string) : '';
	if (user) {
		return {
			user,
			token,
		};
	}
	return {
		user: undefined,
		token: undefined,
		isLoading: false,
		isError: false,
	};
};
