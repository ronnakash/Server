import { Document } from 'mongoose';

export default interface INote {
    title: string;
    author: string;
    body: string;
}
