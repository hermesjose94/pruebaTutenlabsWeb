import { useReactPWAInstall } from 'hooks/pwa-install';
import { Images } from 'interfaces';
import * as React from 'react';

export const PwaInstallButton = () => {
	const { pwaInstall, supported, isInstalled } = useReactPWAInstall();

	React.useEffect(() => {
		const noShowModalPwa = localStorage.getItem('noShowModalPwa');
		// console.log('mirar noShowModalPwa ', { noShowModalPwa });
		if (!isInstalled && supported && !noShowModalPwa) {
			pwaInstall(
				'Install Web App',
				Images.logo,
				<ul className="list-disc pl-6">
					<li className="mb-1">Keep your session active from your phone</li>
					<li className="mb-1">
						Receive notifications of all your activity within the platform.
					</li>
					<li className="mb-1">Access to all available adventures.</li>
					<li className="mb-1">
						Access to our Vault with valuable information.
					</li>
					<li className="mb-1">And much more...</li>
				</ul>,
				'By installing App  on your phone you will have quick access to all our features.'
			)
				.then(() =>
					console.log(
						'App installed successfully or instructions for install shown'
					)
				)
				.catch(() => console.log('User opted out from installing'));
		}
	}, [supported, isInstalled]);
	return null;
};
