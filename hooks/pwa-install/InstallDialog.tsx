import React from 'react';
import { Typography } from 'components/common/typography';
import { OptionsModalPwa } from 'interfaces';
import { InstallDialogAction } from './InstallDialogAction';
import { InputCheck } from 'components/common/form/input-check';
import { useForm } from 'react-hook-form';

interface InstallDialogProps {
	onSubmit: () => void;
	onCancel: (data: any) => void;
	platform: string;
	options: OptionsModalPwa | undefined;
}

export const InstallDialog: React.FC<InstallDialogProps> = (props) => {
	const { register, handleSubmit } = useForm({
		mode: 'onChange',
	});
	return (
		<form
			className="flex flex-col w-full"
			onSubmit={handleSubmit(props.onCancel)}
		>
			{props.options && (
				<>
					<div className="flex items-center justify-center mb-5">
						<div className="rounded-10 bg-primary py-3 w-[80px] flex items-center justify-center">
							<img src={props.options.logo} alt="logo" className="w-14 h-14" />
						</div>
					</div>
					<Typography type="title" className="text-center">
						{props.options.title}
					</Typography>
					<div className="flex flex-col items-start py-2">
						<div className="w-full">
							<Typography type="sub-title">
								{props.options.description}
							</Typography>
						</div>
						<div>
							<div className="mt-2">{props.options.feactures}</div>
						</div>
						<InputCheck
							name="checkPwa"
							className="mb-3 mt-3"
							register={register}
						>
							Don’t show me again
						</InputCheck>
					</div>
				</>
			)}
			<InstallDialogAction
				platform={props.platform}
				onSubmit={props.onSubmit}
				onClose={props.onCancel}
			/>
		</form>
	);
};
