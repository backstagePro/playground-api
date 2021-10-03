
import { BaseRepository } from "../base/BaseRepository";
import RunSession from "../entities/RunSession";

export const MONGO_DATABASE_RUNS_SESSIONS = 'runSessions';

export default class RunSessionRepository extends BaseRepository<RunSession> {

}