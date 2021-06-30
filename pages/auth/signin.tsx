import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Typography } from 'components/common/typography';
import { Button } from 'components/common/button/button';
import { InputText } from 'components/common/form/input-text';
import { InputPassword } from 'components/common/form/input-password';
import { getSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useToasts } from 'react-toast-notifications';
import { GetServerSideProps } from 'next';
import { LayoutAuth } from 'components/layout';

const SignIn = () => {
	const {
		register,
		handleSubmit,
		errors,
		formState: { isDirty, isValid },
	} = useForm({ mode: 'onChange' });
	const router = useRouter();
	const { addToast } = useToasts();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const rules = {
		email: {
			required: { value: true, message: 'This is required' },
		},
		password: {
			required: { value: true, message: 'This is required' },
		},
	};

	const onSubmitForm = async (data: any) => {
		setIsLoading(true);
		try {
			const response = await signIn('credentials', {
				redirect: false,
				email: data.email,
				password: data.password,
				callbackUrl: '/',
			});
			if (response?.error) {
				setIsLoading(false);
				addToast('user or password invalid', { appearance: 'error' });
			} else {
				setIsLoading(false);
				router.push('/');
			}
		} catch (error) {
			addToast(error, { appearance: 'error' });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<LayoutAuth>
			{/* <Typography type="title">Anime</Typography> */}
			<Typography type="text-base" className="text-center mt-2">
				Welcome back!
			</Typography>
			<form className="w-full" onSubmit={handleSubmit(onSubmitForm)}>
				<InputText
					name="email"
					title="Email"
					register={register}
					rules={rules.email}
					error={errors.email}
				/>
				<InputPassword
					name="password"
					title="Password"
					validate={false}
					register={register}
					rules={rules.password}
					error={errors.password}
				/>
				<Button
					className="mt-3"
					label={isLoading ? 'Loading...' : 'Login'}
					decoration="fill"
					size="full"
					type="submit"
					disabled={!isDirty || !isValid || !!isLoading}
				/>
			</form>
		</LayoutAuth>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	if (session && session.user) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
	return {
		props: { session },
	};
};

export default SignIn;
