import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateOrderItemDTO {

    @ApiProperty()
    @IsOptional()
    productProviderId: string;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isPaidToProvider: boolean;
}