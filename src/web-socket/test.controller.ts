import { Controller, Get } from "@nestjs/common";

@Controller()
export class TestController {

    @Get()
    testGet() {
        return 'get response'
    }
}