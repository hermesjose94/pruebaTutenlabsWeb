import React from 'react';
import { platforms } from './Platforms';
import { Button } from 'components/common/button';
import { Typography } from 'components/common/typography';

const DialogActionWithInstructions: React.FC<{
	action1: string;
	action2: string;
	onSubmit: () => void;
}> = (props) => {
	return (
		<div className="w-full flex flex-col items-center">
			<div>
				<Typography type="title-small">To install this app:</Typography>
				<ul className="list-disc mt-9 pl-6">
					<li className="mb-4">
						<Typography type="sub-title">{props.action1}</Typography>
					</li>
					<li className="mb-4">
						<Typography type="sub-title">{props.action2}</Typography>
					</li>
				</ul>
			</div>
			<div className="w-full text-center">
				<Button onClick={props.onSubmit}>Ok</Button>
			</div>
		</div>
	);
};

interface InstallDialogActionProps {
	platform: string;
	onClose: (check: boolean) => void;
	onSubmit: () => void;
}

export const InstallDialogAction: React.FC<InstallDialogActionProps> = (
	props
) => {
	return (
		<>
			<div>
				{props.platform === platforms.NATIVE && (
					<div className="flex items-center justify-center flex-col-reverse py-2 lg:flex-row">
						<Button size="full" type="submit" className="lg:mr-2">
							Cancel
						</Button>
						<Button
							onClick={props.onSubmit}
							size="full"
							decoration="fill"
							className="mb-5 lg:mb-0"
						>
							Accept and install
						</Button>
					</div>
				)}
				{props.platform === platforms.IDEVICE && (
					<DialogActionWithInstructions
						action1="Tap the share button"
						action2="then find and tap 'Add to Homescreen'"
						onSubmit={props.onSubmit}
					/>
				)}
				{props.platform === platforms.FIREFOX && (
					<DialogActionWithInstructions
						action1="Tap this icon on the address bar"
						action2="then tap '+Add to Homescreen'"
						onSubmit={props.onSubmit}
					/>
				)}
				{props.platform === platforms.FIREFOX_NEW && (
					<DialogActionWithInstructions
						action1="Tap the menu button"
						action2="then tap 'Install'"
						onSubmit={props.onSubmit}
					/>
				)}
				{props.platform === platforms.OPERA && (
					<DialogActionWithInstructions
						action1="Tap the menu button"
						action2="then tap Home screen"
						onSubmit={props.onSubmit}
					/>
				)}
				{props.platform === platforms.OTHER && (
					<div className="flex w-full flex-col">
						<div>
							Unfortunately the install feature is not supported by your
							browser.
						</div>
						<div className="w-full text-right">
							{/* onClick={props.onClose} */}
							<Button
								onClick={props.onSubmit}
								type="submit"
								size="full"
								decoration="fill"
								className="lg:max-w-max"
							>
								Ok
							</Button>
						</div>
					</div>
				)}
			</div>
		</>
	);
};
