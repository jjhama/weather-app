import react from 'react';
import { MdOutlineWaterDrop } from "react-icons/md";
import { FiWind, FiEye, FiSunrise, FiSunset  } from "react-icons/fi";
import { ImMeter } from "react-icons/im";

export interface WeatherDetailProps {
    visibility: string,
    humidity: string,
    windSpeed: string,
    airPressure: string,
    sunRise: string,
    sunSet: string
}

export default function WeatherDetails(props: WeatherDetailProps){

    const {
        visibility = "25km",
        humidity = "61%",
        windSpeed = "7 kmh",
        airPressure = "1012 hPa",
        sunRise = "6:21",
        sunSet = "18:48"
    } = props;

    return (
        <>
            <SingleWeatherDetail
                icon={<FiEye />}
                information='Visibility'
                value={visibility}
            />
            <SingleWeatherDetail
                icon={<MdOutlineWaterDrop />}
                information='Humidity'
                value={humidity}
            />
            <SingleWeatherDetail
                icon={<FiWind />}
                information='Wind Speed'
                value={windSpeed}
            />
            <SingleWeatherDetail
                icon={<ImMeter />}
                information='Air Pressure'
                value={airPressure}
            />
            <SingleWeatherDetail
                icon={<FiSunrise />}
                information='Sun Rise'
                value={sunRise}
            />
            <SingleWeatherDetail
                icon={<FiSunset />}
                information='Sun Set'
                value={sunSet}
            />
        </>
        
    )
}

// WeatherDetails.defaultProps = {
//     visibility: "25km",
//         humidity: "61%",
//         windSpeed: "7 kmh",
//         airPressure: "1012 hPa",
//         sunRise: "6:21",
//         sunSet: "18:48"
// }

export interface SingleWeatherDetailsProps {
    information: string,
    icon: React.ReactNode,
    value: string
}

function SingleWeatherDetail(props: SingleWeatherDetailsProps){
    return (
        <div className=' flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80'>
            <p className=' whitespace-nowrap'>{props.information}</p>
            <div className=' text-3xl'>{props.icon}</div>
            <p>{props.value}</p>
        </div>
    )
}
