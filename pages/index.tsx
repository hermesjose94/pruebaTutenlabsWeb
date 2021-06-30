import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { LayoutDashboard } from 'components/layout';
import clsx from 'clsx';
import { ChevronDownIcon, SearchIcon } from '@heroicons/react/solid';
import { Book } from 'interfaces';
import { useQuery } from 'react-query';
import { getDataBooks, GET_BOOKS } from 'api';
import { useUser } from 'hooks/user';

const Dashboard = () => {
	const { token } = useUser();
	const search = React.useRef<HTMLInputElement>(null);
	const typeFilter = React.useRef<HTMLSelectElement>(null);
	const type = React.useRef<HTMLSelectElement>(null);
	const [books, setBooks] = React.useState<Book[]>();
	const { data, isLoading } = useQuery<Book[]>(
		[GET_BOOKS],
		() => getDataBooks(token || ''),
		{
			keepPreviousData: true,
		}
	);
	React.useEffect(() => {
		setBooks(data);
	}, [data]);

	const handleSearchId = () => {
		const val = search.current?.value;
		const typeF = typeFilter.current?.value;
		const typeSearch = type.current?.value;
		let filter;
		const aux = val as unknown as number;
		if (!isNaN(aux) && val && typeF) {
			if (data) {
				if (typeF === '1') {
					console.log('LIKE');
					filter = data.filter((book) => {
						if (typeSearch === 'id') {
							return `${book.bookingId}`.includes(val);
						} else {
							return `${book.bookingPrice}`.includes(val);
						}
					});
				} else if (typeF === '2') {
					console.log('<=');
					filter = data.filter((book) => {
						if (typeSearch === 'id') {
							return book.bookingId <= Number(val);
						} else {
							return book.bookingPrice <= Number(val);
						}
					});
				} else if (typeF === '3') {
					console.log('>=');
					filter = data.filter((book) => {
						if (typeSearch === 'id') {
							return book.bookingId >= Number(val);
						} else {
							return book.bookingPrice >= Number(val);
						}
					});
				}
			}
			setBooks(filter);
		} else {
			setBooks(data);
		}
	};

	const handleChangeTypeFilter = () => {
		handleSearchId();
	};

	return (
		<LayoutDashboard title="List Books" isLoading={isLoading}>
			<>
				<div className="my-2 flex sm:flex-row flex-col">
					<div className="flex flex-row mb-1 sm:mb-0">
						<div className="relative">
							<select
								onChange={handleChangeTypeFilter}
								ref={type}
								className={clsx(
									'appearance-none h-full rounded-l border-t border-b block w-full bg-white border-gray-200 text-gray-600 py-2 px-4 pr-8 leading-tight',
									' focus:outline-none focus:ring-offset-0 focus:ring-transparent focus:border-gray-200 focus:ring-offset-gray-200'
								)}
							>
								<option value={'id'}>{'ID'}</option>
								<option value={'price'}>{'Price'}</option>
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
								<ChevronDownIcon className="h-4 w-4" />
							</div>
						</div>
						<div className="relative">
							<select
								onChange={handleChangeTypeFilter}
								ref={typeFilter}
								className={clsx(
									'appearance-none h-full border-t border-b block w-full bg-white border-gray-200 text-gray-600 py-2 px-4 pr-8 leading-tight',
									' focus:outline-none focus:ring-offset-0 focus:ring-transparent focus:border-gray-200 focus:ring-offset-gray-200'
								)}
							>
								<option value={1}>{'Like'}</option>
								<option value={2}>{'<='}</option>
								<option value={3}>{'>='}</option>
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
								<ChevronDownIcon className="h-4 w-4" />
							</div>
						</div>
						<div className="flex flex-row mb-1 sm:mb-0">
							<div className="block relative">
								<span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
									<SearchIcon className="h-4 w-4" />
								</span>
								<input
									onChange={handleSearchId}
									placeholder="Search"
									ref={search}
									className={clsx(
										'appearance-none sm:rounded-l-none border border-gray-200 rounded-r block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-600',
										'focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none focus:ring-offset-0 focus:ring-primary'
									)}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="w-full ">
					<>
						<div className="w-full overflow-hidden overflow-x-scroll">
							<table className="min-w-max w-full table-auto">
								<thead>
									<tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
										<th className="py-3 px-6 text-left">BookingId</th>
										<th className="py-3 px-6 text-left">Cliente</th>
										<th className="py-3 px-6 text-center">Fecha de Creación</th>
										<th className="py-3 px-6 text-center">Dirección</th>
										<th className="py-3 px-6 text-center">Precio</th>
									</tr>
								</thead>
								<tbody className="text-gray-600 text-sm font-light">
									{books &&
										books.map((book) => {
											return (
												<tr
													key={`book-${book.bookingId}`}
													className="border-b border-l-2 border-r-2 border-gray-200 hover:bg-gray-100"
												>
													<td className="py-3 px-6 text-center">
														<div className="flex items-center justify-center">
															<span>{book.bookingId}</span>
														</div>
													</td>
													<td className="py-3 px-6 text-left whitespace-nowrap">
														<div className="flex items-center justify-between">
															<div className="flex items-center">
																<span>{`${book.locationId.tutenUser.firstName} ${book.locationId.tutenUser.lastName}`}</span>
															</div>
														</div>
													</td>
													<td className="py-3 px-6 text-left">
														<div className="flex items-center">
															<span>{book.bookingTime}</span>
														</div>
													</td>
													<td className="py-3 px-6 text-left">
														<div className="flex items-center">
															<span>{book.locationId.streetAddress}</span>
														</div>
													</td>
													<td className="py-3 px-6 text-center">
														<div className="flex items-center justify-center">
															<span>{book.bookingPrice}</span>
														</div>
													</td>
												</tr>
											);
										})}
								</tbody>
							</table>
						</div>
					</>
				</div>
			</>
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

export default Dashboard;
