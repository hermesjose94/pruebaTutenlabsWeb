import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { LayoutDashboard } from 'components/layout';
import { useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';
import { Button } from 'components/common/button/button';
import { InputText } from 'components/common/form/input-text';
import { formatTime } from 'api';
import { Typography } from 'components/common/typography';
import { Separator } from 'components/common/separator';

const ApiDate = () => {
	const {
		register,
		handleSubmit,
		errors,
		watch,
		formState: { isDirty, isValid },
	} = useForm({ mode: 'onChange' });
	const { addToast } = useToasts();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [time, setTime] = React.useState('');
	const [zoneTime, setZoneTime] = React.useState('');

	const rules = {
		time: {
			required: { value: true, message: 'This is required' },
		},
		timezone: {
			required: { value: true, message: 'This is required' },
		},
	};

	const onSubmitForm = async (data: any) => {
		const json = {
			time: data.time,
			timezone: data.timezone,
		};
		setIsLoading(true);
		try {
			const response = await formatTime(json);
			const res = await response.json();
			if (res.error) {
				addToast(res.error, { appearance: 'error' });
			} else {
				setTime(res.response.time);
				setZoneTime(res.response.timezone);
			}
			console.log({ res });
		} catch (error) {
			addToast(error, { appearance: 'error' });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<LayoutDashboard title="FORMAT TIME">
			{time && zoneTime && (
				<>
					<Typography type="text-base" className="mt-2">
						{`time: ${time}`}
					</Typography>
					<Typography type="text-base" className="mt-2">
						{`timezone: ${zoneTime}`}
					</Typography>
					<Separator text="" />
				</>
			)}
			<form className="w-full" onSubmit={handleSubmit(onSubmitForm)}>
				<InputText
					name="time"
					title="Hora - format(18:31:45)"
					register={register}
					rules={rules.time}
					error={errors.time}
				/>
				<InputText
					name="timezone"
					title="Zona Horaia - format(-3 or -3:30)"
					className="mb-4"
					// options={timeZones}
					register={register}
					rules={rules.timezone}
					error={errors.timezone}
					// handleChange={(value) => console.log(value)}
				/>
				<Button
					className="mt-3"
					label={isLoading ? 'Loading...' : 'Send'}
					decoration="fill"
					size="full"
					type="submit"
					disabled={!!isLoading}
				/>
			</form>
		</LayoutDashboard>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	console.log('sesion index', session);

	if (!!session && session.user) {
		return {
			props: { session },
		};
	} else {
		return {
			redirect: {
				destination: '/auth/signin',
				permanent: false,
			},
		};
	}
};

export default ApiDate;
