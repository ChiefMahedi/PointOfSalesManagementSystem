export class Customer
{
    id: number;
    name : string;
    email: string;
    password: string;
    address: string;
    phone: string;
    registrationDate: Date;
    gender: string;
    constructor(
        name: string,
        email: string,
        password: string,
        address: string,
        phone: string,
        registrationDate: Date,
        gender: string
    ) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.address = address;
        this.phone = phone;
        this.registrationDate = registrationDate;
        this.gender = gender;
    }
}