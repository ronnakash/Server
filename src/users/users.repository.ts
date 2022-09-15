import { Injectable } from "@nestjs/common";
import { UserDocument } from "../interfaces/user";
import { ModelsRepository } from "../models/models.repository";

@Injectable()
export class NotesRepository extends ModelsRepository<UserDocument> {


}