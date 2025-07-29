import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OptionsService } from './options.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Post()
  create(@Body() createOptionDto: CreateOptionDto) {
    return this.optionsService.create(createOptionDto);
  }

  @Get()
  findAll() {
    return this.optionsService.findAll();
  }

  @Get('complete')
  findAllWithRelations() {
    return this.optionsService.findAllWithRelations();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.optionsService.findOne(id);
  }

  @Get(':id/complete')
  findOneWithRelations(@Param('id') id: string) {
    return this.optionsService.findOneWithRelations(id);
  }

  @Get(':id/companies')
  findCompaniesByOption(@Param('id') id: string) {
    return this.optionsService.findCompaniesByOption(id);
  }

  @Get(':id/details')
  findDetailsByOption(@Param('id') id: string) {
    return this.optionsService.findDetailsByOption(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOptionDto: UpdateOptionDto) {
    return this.optionsService.update(id, updateOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.optionsService.remove(id);
  }
}
