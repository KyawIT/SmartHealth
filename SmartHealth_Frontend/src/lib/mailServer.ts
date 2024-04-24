export class Message{
    private name:string;
    private email:string;
    private subject:string;
    private message:string;

    constructor(name:string ,email:string, subject:string, message:string){
        this.name = name;
        this.email = email;
        this.subject = subject;
        this.message = message;
    }
}

export function checkMessageInput(message: Message){
    
}