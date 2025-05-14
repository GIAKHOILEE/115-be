import { Controller, Body, Get, Param, Put, Delete } from '@nestjs/common'
import { DoctorService } from './doctor.service'
import { Doctor } from './doctor.entity'
import { ResponseDto } from 'src/common/response.dto'

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  //   @Post()
  //   async createDoctor(@Body() doctor: Doctor): Promise<ResponseDto> {
  //     const data = await this.doctorService.createDoctor(doctor)
  //     return new ResponseDto({
  //       messageCode: 'CREATE_DOCTOR_SUCCESS',
  //       statusCode: 200,
  //       data,
  //     })
  //   }

  @Get()
  async getAllDoctors(): Promise<ResponseDto> {
    const data = await this.doctorService.getAllDoctors()
    return new ResponseDto({
      messageCode: 'GET_ALL_DOCTORS_SUCCESS',
      statusCode: 200,
      data,
    })
  }

  @Get(':id')
  async getDoctor(@Param('id') id: number): Promise<ResponseDto> {
    const data = await this.doctorService.getDoctor(id)
    return new ResponseDto({
      messageCode: 'GET_DOCTOR_SUCCESS',
      statusCode: 200,
      data,
    })
  }

  @Put(':id')
  async updateDoctor(@Param('id') id: number, @Body() doctor: Doctor): Promise<ResponseDto> {
    const data = await this.doctorService.updateDoctor(id, doctor)
    return new ResponseDto({
      messageCode: 'UPDATE_DOCTOR_SUCCESS',
      statusCode: 200,
      data,
    })
  }

  @Delete(':id')
  async deleteDoctor(@Param('id') id: number): Promise<ResponseDto> {
    const data = await this.doctorService.deleteDoctor(id)
    return new ResponseDto({
      messageCode: 'DELETE_DOCTOR_SUCCESS',
      statusCode: 200,
      data,
    })
  }
}
