import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
   provider_id: string;
   day: number;
   month: number;
   year: number;
}

/**
 * [ { day: 1, available: false } ]
 */

 type IResponse = Array<{
     hour: number;
     available: boolean;
 }>

@injectable()
class ListProviderDayAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ) {}

    public async execute({ provider_id, year, month, day }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
            provider_id,
            year,
            month,
            day,
        });

        const hourStart = 8; // começar horatio de atendimento as 08 AM

        const eachHourArray = Array.from({ length: 10 }, (_, index) => index + hourStart);

        const currentDate = new Date(Date.now());

        const availability = eachHourArray.map(hour => {
            const hashAppointmentHour = appointments.find(appoinment => 
                    getHours(appoinment.date) === hour,
            );

            const compareDate = new Date(year, month - 1, day, hour);

            // 2020-05-20 08:00
            // 2020-05-20 09:00

            return {
                hour,
                available: !hashAppointmentHour && isAfter(compareDate, currentDate),
            }
        });

        return availability;
    }
}

export default ListProviderDayAvailabilityService;