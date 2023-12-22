import { Transform } from "class-transformer";
import { ArrayMinSize, IsArray, IsDefined } from "class-validator";

export class EnvSchema {
    @Transform(({value}) => isNaN(value) && value != '*' ? '*' : value)
    APP_PORT?: number|string

    @IsDefined()
    CORS_ORIGIN?: string

    @Transform(({value}) => value.split(','))
    @IsArray()
    @ArrayMinSize(1)
    CORS_METHODS?: string[]
}
