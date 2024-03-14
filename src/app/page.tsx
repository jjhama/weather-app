'use client';
/** @format */

import Navbar from "@/components/Navbar";
import { useQuery } from "react-query";
import axios from "axios";
import { format, formatISO, fromUnixTime, parseISO } from "date-fns";
import Container from "@/components/Container";
import WeatherIcon from "@/components/WeatherIcon";
import WeatherDetails from '@/components/WeatherDetails';
import ForecastWeatherDetail from "@/components/ForcastWeatherDetail";
import { convertMetersPerSecondToKilometersPerHour, convertMtoKm, getDayOrNightIcon, kelvinToCelcuis } from '@/utils/utils'
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "./atom";
import { useEffect } from "react";

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherEntry[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

interface WeatherEntry {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string; 
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  rain?: {
    '3h': number;
  };
  sys: {
    pod: string;
  };
  dt_txt: string;
}


export default function Home() {
  const [place,setPlace] = useAtom(placeAtom);
  const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom);
  
  const { isLoading, error, data, refetch } = useQuery<WeatherData>(
    'repoData', 
    async () => {
      const {data} = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=65`)
      return data;
    }
  )

  useEffect(()=> {
    refetch();
  }, [place, refetch])

  console.log(data, data?.city.country);

  const currentDate = data?.list[0];
  const currentCity = data?.city;

  const forecastDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ]
  
  console.log(forecastDates) 

  const firstDateOfEach = forecastDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    })
  })

  console.log(firstDateOfEach) 


  if(isLoading) 
    return (
    <div className="flex items-center min-h-screen justify-center">
      <p className="animate-bounce">
        Loading...
      </p>
    </div>
  )


  return (
    
    <div className = "flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar location={data?.city.name}/>
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        
        { loadingCity ? <WeatherSkeleton /> :
        <> 
        

          {/* today */}
          <section className="space-y-4">
            <div className="space-y-2">
              <h2 className="flex gap-1 text-2xl items-end">
                <p className = 'text-2xl'>{format(parseISO(currentDate?.dt_txt ?? ''), 'EEEE')}</p>
                <p className = 'text-lg'>({format(parseISO(currentDate?.dt_txt ?? ''), 'dd.MM.yyyy')})</p>
              </h2>
              <Container className = " gap-10 px-6 items-center">
                <div className=" flex flex-col px-4 ">
                  <span className="text-5xl">
                    {kelvinToCelcuis(currentDate?.main.temp ?? 273.15)}°
                  </span>
                  <p className = " text-xs space-x-1 whitespace-nowrap">
                    <span>feels like</span>
                    <span>
                    {kelvinToCelcuis(currentDate?.main.feels_like ?? 273.15)}°
                    </span>
                  </p>
                  <p className="text-xs space-x-2">
                    <span>
                      {kelvinToCelcuis(currentDate?.main.temp_min ?? 273.15)}°↓
                    </span>
                    <span>
                      {kelvinToCelcuis(currentDate?.main.temp_max ?? 273.15)}°↑
                    </span>
                  </p>
                </div>
                <div className=" flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                    {data?.list.map((d : WeatherEntry,i : number) => 
                      <div 
                        key={i} 
                        className=" flex flex-col justify-between gap-2 items-center text-xs font-semibold ">
                          <p className=" whitespace-nowrap ">{format(parseISO(d?.dt_txt), "h:mm a")}</p>
                          <WeatherIcon iconname={getDayOrNightIcon(d?.weather[0].icon, d?.dt_txt)} />
                          <p>
                          {kelvinToCelcuis(d?.main.temp ?? 273.15)}°
                          </p>
                      </div>
                    )}
                  </div>
              </Container>

              <div className = " flex gap-10">
                <Container className = " w-fit justify-center flex-col px-4 items-center ">
                  <p>{currentDate?.weather[0].description}</p>
                  <WeatherIcon iconname={getDayOrNightIcon(currentDate?.weather[0].icon ?? "", currentDate?.dt_txt ?? "")} />
                </Container>
                <Container className="bg-yellow-300 px-6 gap-4 justify-between overflow-x-auto ">
                  <WeatherDetails 
                    visibility={`${(convertMtoKm(currentDate?.visibility ?? 696969)).toFixed(1)} km`}
                    humidity={`${currentDate?.main.humidity}%`}
                    windSpeed={`${(currentDate?.wind.speed ?? 0).toFixed(1)} km/h`}
                    airPressure={`${currentDate?.main.pressure} hPa`}
                    sunRise={format(fromUnixTime(data?.city.sunrise ?? 1710078477), "H:mm")}
                    sunSet={format(fromUnixTime(data?.city.sunset ?? 1710078477), "H:mm")}
                  />  
                </Container>
              </div>
            </div>
          </section>

          {/* forecast */}
          <section className="flex w-full flex-col gap-4 ">
            <p className="text-2xl">7 Day Forecast </p>
            {firstDateOfEach.map((d, i) => {
              return <ForecastWeatherDetail 
                      key = {i}
                      description={d?.weather[0].description ?? ""}
                      weatherIcon={d?.weather[0].icon ?? "01d"}
                      date={format(parseISO(d?.dt_txt ?? "2024-01-01"), 'dd.MM')}
                      day={format(parseISO(d?.dt_txt ?? "2024-01-01"), 'EEEE')}
                      feelsLike={d?.main.feels_like ?? 0}
                      temp={d?.main.temp ?? 0}
                      tempMax={d?.main.temp_max ?? 0}
                      tempMin={d?.main.temp_min ?? 0}
                      airPressure={`${d?.main.pressure} hPa`}
                      humidity={`${d?.main.humidity}%`}
                      sunRise={format(fromUnixTime(data?.city.sunrise??0), "H:mm")}
                      sunSet={format(fromUnixTime(data?.city.sunset??0), "H:mm")}
                      visibility={`${convertMtoKm(d?.visibility ?? 696969).toFixed(1)} km`}
                      windSpeed={`${convertMetersPerSecondToKilometersPerHour(d?.wind.speed ?? 0).toFixed(1)} km/h`}/>
            })}
          </section>
        </>}

      </main>
    </div>
  );

  function WeatherSkeleton() {
    return (
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
          {/* today */}
          <section className="space-y-4">
              <div className="space-y-2">
                  {/* Skeleton loading placeholders for today's weather */}
                  <div className="animate-pulse space-y-4">
                      <div className="h-6 bg-gray-200 rounded"></div>
                      <div className="flex justify-between">
                          <div className="flex-1 space-y-4 py-1">
                              <div className="h-4 bg-gray-200 rounded"></div>
                              <div className="h-4 bg-gray-200 rounded"></div>
                              <div className="h-4 bg-gray-200 rounded"></div>
                          </div>
                          <div className="flex-1 space-y-4 py-1">
                              <div className="h-6 bg-gray-200 rounded"></div>
                              <div className="h-4 bg-gray-200 rounded"></div>
                              <div className="h-4 bg-gray-200 rounded"></div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          {/* forecast */}
          <section className="flex w-full flex-col gap-4 ">
              <p className="text-2xl">7 Day Forecast </p>
              {/* Skeleton loading placeholders for forecast */}
              <div className="animate-pulse space-y-4">
                  {[...Array(7)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                          <div className="flex-1 space-y-4 py-1">
                              <div className="h-6 bg-gray-200 rounded"></div>
                              <div className="h-4 bg-gray-200 rounded"></div>
                              <div className="h-4 bg-gray-200 rounded"></div>
                          </div>
                          <div className="flex-1 space-y-4 py-1">
                              <div className="h-6 bg-gray-200 rounded"></div>
                              <div className="h-4 bg-gray-200 rounded"></div>
                              <div className="h-4 bg-gray-200 rounded"></div>
                          </div>
                      </div>
                  ))}
              </div>
          </section>
      </main>
    );
  }
}

