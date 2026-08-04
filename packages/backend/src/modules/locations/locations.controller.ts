import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Locations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva sede' })
  async create(
    @CurrentUser('accountId') accountId: string,
    @Body() dto: CreateLocationDto,
  ) {
    return this.locationsService.create(accountId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar sedes de la cuenta' })
  async findAll(@CurrentUser('accountId') accountId: string) {
    return this.locationsService.findAll(accountId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una sede' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser('accountId') accountId: string,
  ) {
    return this.locationsService.findOne(id, accountId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una sede' })
  async update(
    @Param('id') id: string,
    @CurrentUser('accountId') accountId: string,
    @Body() dto: UpdateLocationDto,
  ) {
    return this.locationsService.update(id, accountId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una sede (soft delete)' })
  async remove(
    @Param('id') id: string,
    @CurrentUser('accountId') accountId: string,
  ) {
    return this.locationsService.remove(id, accountId);
  }
}
