
export function kelvinToCelcuis(tempInKelvin: number): number {
    const tempInCelcius = tempInKelvin - 273.15;
    return Math.floor(tempInCelcius);
}

export function getDayOrNightIcon(
    iconName:string,
    dateTimeString:string
) : string {

    const hours = new Date(dateTimeString).getHours();

    const isDayTime = hours >= 6 && hours < 18;

    return iconName.replace(/.$/, (isDayTime) ? "d": "n");
}

export function convertMetersPerSecondToKilometersPerHour(
    input:number
) : number {
    return 3.6 * input;
}

export function convertMtoKm(
    input:number
) : number {
    return input / 1000;
}
    
