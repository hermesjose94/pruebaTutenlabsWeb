import type { NextApiRequest, NextApiResponse } from 'next';

const getIntAndDecimal = (val: number) => [
	Math.floor(val),
	Number((val % 1).toFixed(2)),
];

const formatTime = (val: number) => {
	return val < 10 ? `0${val}` : `${val}`;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		const { time, timezone } = JSON.parse(req.body);
		try {
			const times = time.split(':');
			if (times.length === 3) {
				const timesZones = timezone.split(':');
				const timeZoneHour = Number(timesZones[0] * -3600);
				const timeZoneMin =
					timesZones.length > 1 ? Number(timesZones[1] * -60) : 0;
				const secs = Number(time.split(':')[2]);
				const minAsSec = Number(time.split(':')[1] * 60) + timeZoneMin;
				const hourAsSec = Number(time.split(':')[0] * 3600) + timeZoneHour;
				const resultInSec = hourAsSec + minAsSec + secs;

				const [resultTimeHour, remaimingTimeHour] = getIntAndDecimal(
					resultInSec / 3600
				);
				const [resultTimeMin] = getIntAndDecimal(remaimingTimeHour * 60);

				const finalResult = `${formatTime(resultTimeHour)}:${formatTime(
					resultTimeMin
				)}:${formatTime(secs)}`;

				res.statusCode = 200;
				res.json({
					response: {
						time: finalResult,
						timezone: 'utc',
					},
				});
			} else {
				res.statusCode = 200;
				res.json({ error: 'Formato no valido: hh:mm:ss' });
			}
		} catch (error) {
			console.log('error', error);
			res.statusCode = 200;
			res.json({ error });
		}
	}
};
