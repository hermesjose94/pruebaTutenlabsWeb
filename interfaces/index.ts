export enum Images {
	avatar = '/img/png/avatar.png',
	circuit = '/img/auth/circuit.svg',
	logo = '/img/png/logo.png',
}

export type ImagesType = Images.avatar | Images.circuit | Images.logo;

export type OptionType = {
	text: string;
	value: string;
	disabled: boolean;
	placeholder: boolean;
};

export type UserType = {
	email: string;
	firstName: string;
	lastName: string;
};

export type SesionType = {
	expires: string;
	token: string;
	user: UserType;
};

export type Book = {
	bookingId: number;
	bookingTime: number;
	bookingPrice: number;
	locationId: {
		streetAddress: string;
		tutenUser: {
			firstName: string;
			lastName: string;
		};
	};
};

export type ApiDate = {
	time: string;
	timezone: string;
};

export type OptionsModalPwa = {
	title: string;
	logo: ImagesType;
	feactures: React.ReactNode;
	description: string;
};
