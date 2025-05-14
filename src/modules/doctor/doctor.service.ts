import { Injectable, NotFoundException } from '@nestjs/common'
import { Doctor } from './doctor.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async getDoctor(id: number): Promise<Doctor> {
    const existDoctor = await this.doctorRepository.findOne({ where: { id } })
    if (!existDoctor) {
      throw new NotFoundException('Doctor not found')
    }
    return existDoctor
  }

  async updateDoctor(id: number, doctor: Doctor): Promise<UpdateResult> {
    const existDoctor = await this.doctorRepository.findOne({ where: { id } })
    if (!existDoctor) {
      throw new NotFoundException('Doctor not found')
    }

    const updatedDoctor = this.doctorRepository.create({
      ...existDoctor,
      ...doctor,
    })
    return this.doctorRepository.update(id, updatedDoctor)
  }

  async deleteDoctor(id: number): Promise<DeleteResult> {
    return this.doctorRepository.delete(id)
  }
}
