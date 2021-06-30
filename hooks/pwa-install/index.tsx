import React, {
	useState,
	useRef,
	useEffect,
	createContext,
	useContext,
} from 'react';
import { platforms, getPlatform } from './Platforms';
import { InstallDialog } from './InstallDialog';
import { useModal } from 'hooks/use-modal';
import { ImagesType, OptionsModalPwa } from 'interfaces';

interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[];
	readonly userChoice: Promise<{
		outcome: 'accepted' | 'dismissed';
		platform: string;
	}>;
	prompt(): Promise<void>;
}

declare global {
	interface WindowEventMap {
		beforeinstallprompt: BeforeInstallPromptEvent;
	}
	interface Navigator {
		standalone: boolean;
	}
}

interface ReactPWAInstallContextType {
	supported: boolean;
	isInstalled: boolean;
	pwaInstall: (
		title: string,
		logo: ImagesType,
		feactures: React.ReactNode,
		description: string
	) => Promise<unknown>;
}

const ReactPWAInstallContext = createContext<ReactPWAInstallContextType>({
	supported: false,
	isInstalled: false,
	pwaInstall: () => new Promise((resolve) => resolve),
});

export const useReactPWAInstall = () => useContext(ReactPWAInstallContext);

export const ReactPWAInstallProvider: React.FC<{ enableLogging: boolean }> = ({
	children,
	enableLogging = true,
}) => {
	const { Modal, isShow, hide, show } = useModal();
	const [platform, setPlatform] = React.useState<string>('');
	const [options, setOptions] = React.useState<OptionsModalPwa>();
	const awaitingPromiseRef = useRef<{
		resolve: (value?: unknown) => void;
		reject: (reason?: any) => void;
	} | null>(null);
	const deferredprompt = useRef<BeforeInstallPromptEvent | null>(null);
	// const [dialogState, setDialogState] = useState(null);
	const [contextValue, setContextValue] = useState({
		supported: false,
		isInstalled: false,
		pwaInstall: openDialog,
	});

	useEffect(() => {
		setPlatform(getPlatform());
		window.addEventListener(
			'beforeinstallprompt',
			handleBeforeInstallPromptEvent
		);
		return function cleanup() {
			window.removeEventListener(
				'beforeinstallprompt',
				handleBeforeInstallPromptEvent
			);
		};
	}, []);

	function logger(message: string) {
		if (enableLogging) {
			console.log(message);
		}
	}

	function isInstalled() {
		if (
			window.navigator.standalone === true ||
			window.matchMedia('(display-mode: standalone)').matches
		) {
			logger('isInstalled: true. Already in standalone mode');
			return true;
		}
		logger('isInstalled: false.');
		return false;
	}

	function supported() {
		if (deferredprompt.current != null && platform === platforms.NATIVE) {
			logger('supported: true - native platform');
			return true;
		}
		if (platform !== platforms.NATIVE && platform !== platforms.OTHER) {
			logger('supported: true - manual support');
			return true;
		}
		logger('supported: false');
		return false;
	}

	function handleBeforeInstallPromptEvent(event: BeforeInstallPromptEvent) {
		event.preventDefault();
		deferredprompt.current = event;
		logger('beforeinstallprompt event fired and captured');
		setContextValue({
			supported: supported(),
			isInstalled: isInstalled(),
			pwaInstall: openDialog,
		});
	}

	function openDialog(
		title: string,
		logo: ImagesType,
		feactures: React.ReactNode,
		description: string
	) {
		show();
		setOptions({ title, logo, feactures, description });
		return new Promise((resolve, reject) => {
			awaitingPromiseRef.current = { resolve, reject };
		});
	}

	function handleClose(data: any) {
		if (data.checkPwa) {
			window.localStorage.setItem('noShowModalPwa', data.checkPwa);
		}
		hide();
		if (awaitingPromiseRef.current) {
			awaitingPromiseRef.current.reject();
		}
	}

	function handleInstall() {
		logger('handleInstall called');
		hide();
		if (deferredprompt.current !== null) {
			return deferredprompt.current
				.prompt()
				.then(() => deferredprompt.current?.userChoice)
				.then((choiceResult) => {
					if (choiceResult?.outcome === 'accepted') {
						logger('PWA native installation succesful');
						if (awaitingPromiseRef.current) {
							awaitingPromiseRef.current.resolve();
						}
					} else {
						logger('User opted out by cancelling native installation');
						if (awaitingPromiseRef.current) {
							awaitingPromiseRef.current.reject();
						}
					}
				})
				.catch(() => {
					if (awaitingPromiseRef.current) {
						awaitingPromiseRef.current.resolve();
					}
					logger('Error occurred in the installing process: ');
				});
		} else {
			if (awaitingPromiseRef.current) {
				awaitingPromiseRef.current.resolve();
			}
		}
	}

	return (
		<>
			<ReactPWAInstallContext.Provider value={contextValue}>
				{children}
			</ReactPWAInstallContext.Provider>

			<Modal isShow={isShow}>
				<InstallDialog
					onSubmit={handleInstall}
					onCancel={handleClose}
					platform={platform}
					options={options}
				/>
			</Modal>
		</>
	);
};

export default ReactPWAInstallProvider;
