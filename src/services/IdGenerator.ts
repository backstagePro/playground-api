import crypto from 'crypto';

export default class IdGenerator {

    public generateId(): string {

        return crypto.randomBytes(20).toString('hex');
    }
}