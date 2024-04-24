"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
class Message {
    constructor(from, subject, html) {
        this.from = from;
        this.subject = subject;
        this.html = html;
    }
}
exports.Message = Message;
Message.to = "smarthealthorganisation@gmail.com";
