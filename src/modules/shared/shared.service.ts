import axios from "axios"

export interface Coordinates {
    x: string,
    y: string,
}

interface CommonElementValue {
    text: string;
    value: string;
}

interface Element {
    distance: CommonElementValue;
    duration: CommonElementValue;
    status: string;
}

interface Row {
    elements: Element[];
}

interface DistanceMatrixAxiosResponse {
    data: {
        rows: Row[];
    }
}

interface Result {
    geometry: {
        location: {
            lat: number;
            lng: number;
        }
    }
}
interface GeocodingAxioResponse {
    data: {
        results: Result[];
    }
}

export class SharedService {
    constructor() {}

    public static async getDistance(origin: Coordinates, destination: Coordinates): Promise<DistanceMatrixAxiosResponse> {
        const config = {
            method: "get",
            url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.x}%2C${origin.y}&destinations=${destination.x}%2C${destination.y}&key=${process.env.DISTANCE_MATRIX_API_KEY}`,
            headers: { }
          };

        return axios(config)
    }

    public static async getGeo(address: string): Promise<GeocodingAxioResponse> {
        const config = {
            method: "get",
            url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.DISTANCE_MATRIX_API_KEY}`,
            headers: { }
          };

        return axios(config)
    }
}
