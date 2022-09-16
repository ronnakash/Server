import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument } from "../interfaces/user";
import { ModelsRepository } from "../models/models.repository";
import { UserModel } from "../schemas/user";

@Injectable()
export class UsersRepository extends ModelsRepository<UserDocument> {

    constructor(@InjectModel("User") private userModel: Model<UserDocument>
    ) {
        super(userModel);
    }

}