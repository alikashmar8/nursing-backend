import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateProductProviderDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;
}
