import { IsDefined, IsString } from "class-validator";

export default class Test {
  @IsDefined()
  @IsString()
  id: string;

  @IsDefined()
  @IsString()
  val: string;
}
