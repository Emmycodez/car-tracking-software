export type LoginProps ={
  email: string;
  password: string;
}

export type UserProps ={
  name: string;
  email:string;
  password: string;
}

export interface Vehicle {
    id: string
    name: string
    licensePlate: string
    driver: string
    status: string
    location: string
    speed: number
    lastUpdate: string
    fuel: number
    battery: number
    temperature: number
    ignition: boolean
    coordinates: { lat: number, lng: number },
}