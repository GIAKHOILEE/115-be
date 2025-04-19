import { IsArray, IsObject, IsOptional } from 'class-validator'
import { IDoctorInfo, IRecord } from '../medical-record.interface'

export class UpdateMedicalRecordDto {
  @IsOptional()
  @IsObject()
  doctor: IDoctorInfo

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  records: IRecord[]
}
