/** @format */
'use client';
import { MdWbSunny, MdMyLocation, MdOutlineLocationOn } from "react-icons/md";
import SearchBox from './SearchBox';
import React from 'react'
import { useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "@/app/atom";

type Props = {
    location?: string
}

export default function Navbar({location} : Props){

    const [city, setCity] = useState("");
    const [error, setError] = useState("");
    const [suggestions, setSuggestion] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestion] = useState(false);
    const [place, setPlace] = useAtom(placeAtom);
    const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom)
     
    
    async function handleInputChange(value: string){
        setCity(value);
        if (value.length >= 3) {
            try {
                const res = await axios.get(
                    `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
                )

                const suggestion = res.data.list.map((item: any) => item.name)

                setSuggestion(suggestion);
                setError('');
                setShowSuggestion(true);
            } catch (error) {
                setSuggestion([]);
                setShowSuggestion(false);
            } 
        } else {
            setSuggestion([]);
            setShowSuggestion(false);                
        }
    }

    function handleSuggestionClick(value: string){
        setCity(value);
        setShowSuggestion(false);
    } 

    function handleSubmitSearch(event: React.FormEvent<HTMLFormElement> ){
        setLoadingCity(true);
        event.preventDefault();
        if(suggestions.length == 0){
            setError("Location Not Found");
            setLoadingCity(false);
        } else {
            setError("");
            setTimeout(() => {
                setLoadingCity(false);
                setPlace(city);
                setShowSuggestion(false);
            }, 1000)
        }
    }

    function handleCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async(position) => {
                const {latitude, longitude} = position.coords;
                try{
                    setLoadingCity(true);
                    const res = await axios.get(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
                    );
                    setTimeout(() => {
                        setLoadingCity(false);
                        setPlace(res.data.name);
                    }, 1000);
                } catch (error) {
                    setLoadingCity(false);
                }
            })
        }
    }

    return (
        <>
            <nav className="shadow-sm sticky top-0 left-0 z-50 bg-blue-100">
                <div className= "h-[80px]   w-full   flex   justify-between items-center    max-w-7x1 px3   mx-auto">
                    <div className = "flex items-center justify-center gap-2">
                        <h2 className = "text-gray-500 text-3xl">Weather</h2>
                        <MdWbSunny className = "text-3xl mt-1 text-yellow-300"/>
                    </div>
                    <section className= "flex gap-2 items-center">
                        <MdMyLocation 
                            className = "text 2-XL text-gray-400 hover:opacity-80 cursor-pointer" 
                            onClick={handleCurrentLocation}
                        />
                        <MdOutlineLocationOn className = "text-3xl"/>
                        <p className="text-slate-900/80 text-sm">{place}</p>

                        {/* computers will show this view */}
                        <div className="relative hidden md:flex">
                            <SearchBox 
                                className=""
                                value={city}
                                onSubmit={handleSubmitSearch}
                                onChange={(e)=>handleInputChange(e.target.value)}
                            />
                            <SuggestionBox 
                                {...{
                                    showSuggestions,
                                    suggestions,
                                    error,
                                    handleSuggestionClick   
                                }}
                            />
                        </div>
                    </section>
                </div>
            </nav>

            {/* mobile view will show this */}
            <section className=" flex max-w-7xl px-3 md:hidden">
                    
                <div className=" relative ">
                <SearchBox 
                    className=""
                    value={city}
                    onSubmit={handleSubmitSearch}
                    onChange={(e)=>handleInputChange(e.target.value)}
                />
                <SuggestionBox 
                    {...{
                        showSuggestions,
                        suggestions,
                        error,
                        handleSuggestionClick   
                    }}
                />
            </div>
        </section>
    </>
    )
}


function SuggestionBox({
    showSuggestions,
    suggestions,
    handleSuggestionClick,
    error
} : {
    showSuggestions: boolean;
    suggestions: string[];
    handleSuggestionClick: (item: string) => void;
    error: string;
}) {
    return (
        <> {(showSuggestions && suggestions.length > 1 || error) && ( 
            <ul className="mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2 ">
                {error && suggestions.length < 1 && (
                    <li className="text-red-500 p-1"> {error} </li>
                )}
                {suggestions.map((item, i) => (
                    <li
                        key={i}
                        onClick={() => handleSuggestionClick(item)}
                        className="cursor-pointer p-1 rounded hover:bg-gray-200"
                    >
                        {item}    
                    </li>
                ))}
                <li className="cursor-pointer p-1 hover:bg-gray-200"></li>
            </ul>)}
        </> 
        
    )
}
