import type { NextApiRequest, NextApiResponse } from 'next';
import moment from 'moment-timezone';
import { timeZones } from 'const';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		const { time, timezone } = JSON.parse(req.body);

		try {
			const zone = timeZones.find((zone) => {
				return zone.value === timezone;
			});
			if (zone) {
				const timeUTC = moment
					.tz(time, 'hh:mm:ss', zone.text)
					.utc()
					.format('HH:mm:ss');
				console.log(timeUTC);
				res.statusCode = 200;
				res.json({ time: timeUTC, timezone: `utc con ${timezone}` });
			} else {
				res.statusCode = 200;
				res.json({ error: 'zona no encontrada' });
			}
		} catch (error) {
			console.log('error', error);
			res.statusCode = 200;
			res.json({ error });
		}
	}
};
