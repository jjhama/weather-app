import react from 'react';
import Container from './Container';
import WeatherIcon from './WeatherIcon';
import WeatherDetails, { WeatherDetailProps } from './WeatherDetails';

import { kelvinToCelcuis } from '@/utils/utils';

export interface ForecastWeatherDetailProps extends WeatherDetailProps {
    weatherIcon: string,
    date: string,
    day: string,
    temp: number,
    feelsLike: number,
    tempMin: number,
    tempMax: number,
    description: string
}

export default function ForecastWeatherDetail(props: ForecastWeatherDetailProps) {
    
    const {
        weatherIcon = "",
        date = "",
        day = "",
        temp = 0,
        feelsLike = 0,
        tempMin = 0,
        tempMax = 0,
        description = ""
    } = props;

    return (
        <Container className=' gap-4 '>
            <section className=' flex gap-4 items-center px-4'>
                <div className=' flex flex-col gap-1 items-center'>
                    <WeatherIcon iconname={weatherIcon} />
                    <p>{date}</p>
                    <p>{day}</p>
                </div>

                <div className=' flex flex-col px-4'>
                    <span className=' text-5xl'>{kelvinToCelcuis(temp ?? 0)}</span>
                    <p className='text-xs space-x-1 whitespace-nowrap '>
                        <span>Feels Like</span>
                        <span>{kelvinToCelcuis(feelsLike ?? 0)}</span>
                    </p>
                    <p>{description}</p>
                </div>
            </section>

            <section className = ' overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10'>
                <WeatherDetails {...props} />
            </section>
        </Container>
    )
}

// ForecastWeatherDetail.defaultProps = {
//     visibility: "25km",
//     humidity: "61%",
//     windSpeed: "7 kmh",
//     airPressure: "1012 hPa",
//     sunRise: "6:21",
//     sunSet: "18:48"
// }
