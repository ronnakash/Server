import { Controller, Get } from "@nestjs/common";

@Controller('')
export class GreeterController {

    @Get('')
    async hello(){
        return {
            message: "Hello!"
        }
    }

}