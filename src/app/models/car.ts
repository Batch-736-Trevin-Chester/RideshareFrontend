import { User } from './user';

export class Car {
    /**
     * Set Car model
     */
    carId: number;
    /**
     * Set color as a string 
     */
    color: string;
    /**
     * Set seats as a number
     */
    seats: number;
    /**
     * Set available seats as a number
     */
    availableSeats: number;
    /**
     * Set make as a string
     */
    make: string;
    /**
     * Set model as a string
     */
    model: string;
    /**
     * Set year as a number
     */
    year: number;
    /**
     * Attached a user object
     */
    user: User = new User();
}