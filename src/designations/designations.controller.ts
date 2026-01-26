import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { DesignationsService } from './designations.service';
import { Permissions } from 'src/decorators/permissions.decorator';
import { CreateDesignationDto } from './dto/designations.dto';

@Controller('designations')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class DesignationsController {
  constructor(private readonly designationsService: DesignationsService) {}

  @Get()
  @Permissions('designation:read', 'designation:manage')
  async fetchAll() {
    const designations = await this.designationsService.getDesignations();
    return {
      statuscode: 200,
      message: 'Designations fetched successfully',
      data: designations,
    };
  }

  @Get(':id')
  @Permissions('designation:view', 'designation:manage')
  async fetchById(@Param('id') id: string) {
    const designation = await this.designationsService.getDesignationById(id);
    return {
      statuscode: 200,
      message: 'Designation fetched successfully',
      data: {
        ...designation,
      },
    };
  }

  @Post()
  @Permissions('designation:create', 'designation:manage')
  async create(@Body() input: CreateDesignationDto) {
    const designation = await this.designationsService.create(input);
    return {
      statuscode: 201,
      message: 'Designation created successfully',
      data: {
        ...designation,
      },
    };
  }

  @Put(':id')
  @Permissions('designation:update', 'designation:manage')
  async update(@Param('id') id: string, @Body() input: CreateDesignationDto) {
    const designation = await this.designationsService.update(id, input);
    return {
      statuscode: 200,
      message: 'Designation updated successfully',
      data: {
        ...designation,
      },
    };
  }

  @Delete(':id')
  @Permissions('designation:delete', 'designation:manage')
  async delete(@Param('id') id: string) {
    const designation = await this.designationsService.delete(id);
    return {
      statuscode: 200,
      message: 'Designation deleted successfully',
      data: {
        ...designation,
      },
    };
  }
}
