//Admin Entity
export class Admin
{
    id?: string;
    name : string;
    email: string;
    password: string;
    address: string;
    phone: string;
    registrationDate: Date;
    constructor(
        name: string,
        email: string,
        password: string,
        address: string,
        phone: string,
        registrationDate: Date,
    ) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.address = address;
        this.phone = phone;
        this.registrationDate = registrationDate;
    }
}