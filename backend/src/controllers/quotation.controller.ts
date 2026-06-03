import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseInterceptors, UploadedFile, BadRequestException, Req, RawBodyRequest, Res, Header } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { QuotationService } from '../services/quotation.service';
import { PriceImportService } from '../services/price-import.service';
import { PriceStoreService } from '../services/price-store.service';
import { CreateQuotationDto, UpdateQuotationDto } from '../dto/quotation.dto';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('quotations')
@Controller('quotations')
export class QuotationController {
  constructor(
    private quotationService: QuotationService,
    private priceImportService: PriceImportService,
    private priceStoreService: PriceStoreService,
  ) {}

  @Post()
  @ApiOperation({ summary: '创建报价单' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(@Body() createQuotationDto: CreateQuotationDto) {
    return this.quotationService.create(createQuotationDto);
  }

  @Get()
  @ApiOperation({ summary: '获取报价单列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
  ) {
    return this.quotationService.findAll(page, limit, status);
  }

  @Get('template')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="template.xlsx"')
  @ApiOperation({ summary: '下载价格库导入模板' })
  @ApiResponse({ status: 200, description: '下载成功' })
  async downloadTemplate(@Res() res: Response) {
    const templateDir = path.join(__dirname, '..', '..', '..');
    const templatePath = path.join(templateDir, '报价更新正式生产版模板.xlsx');
    
    console.log('模板目录:', templateDir);
    console.log('模板路径:', templatePath);
    console.log('文件存在:', fs.existsSync(templatePath));
    
    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({ message: '模板文件不存在' });
    }

    const fileStream = fs.createReadStream(templatePath);
    fileStream.pipe(res);
  }

  @Get('prices')
  @ApiOperation({ summary: '获取所有价格数据' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getPrices(@Query('series') series?: string) {
    if (series) {
      return this.priceStoreService.findBySeries(series);
    }
    return this.priceStoreService.findAll();
  }

  @Get('series')
  @ApiOperation({ summary: '获取所有产品系列' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getAllSeries() {
    const series = await this.priceStoreService.getAllSeries();
    return series.map(s => ({
      id: s.id,
      name: s.name,
      image: s.image,
    }));
  }

  @Get('series/:seriesName/models')
  @ApiOperation({ summary: '根据系列名称获取阀门型号' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getModelsBySeries(@Param('seriesName') seriesName: string) {
    const models = await this.priceStoreService.getModelsBySeriesName(seriesName);
    return models.map(m => ({
      id: m.id,
      name: m.name,
      type: m.type_code,
      seriesId: m.series_id,
    }));
  }

  @Get('models')
  @ApiOperation({ summary: '获取所有阀门型号' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getAllModels() {
    const seriesList = await this.priceStoreService.getAllSeries();
    const result: Record<string, any[]> = {};
    
    for (const series of seriesList) {
      const models = await this.priceStoreService.getModelsBySeries(series.id);
      result[series.name] = models.map(m => ({
        id: m.id,
        name: m.name,
        type: m.type_code,
      }));
    }
    
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个报价单详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findOne(@Param('id') id: string) {
    return this.quotationService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新报价单' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(@Param('id') id: string, @Body() updateQuotationDto: UpdateQuotationDto) {
    return this.quotationService.update(id, updateQuotationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除报价单' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id') id: string) {
    return this.quotationService.remove(id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '导入价格库Excel文件(multipart)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: '导入成功' })
  async importPriceMultipart(@UploadedFile() file: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new BadRequestException('请上传文件');
    }

    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('仅支持Excel(xlsx/xls)或CSV文件');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('文件大小不能超过10MB');
    }

    return this.priceImportService.parseExcelFile(file.buffer);
  }

  @Post('import/base64')
  @ApiOperation({ summary: '导入价格库Excel文件(base64)' })
  @ApiResponse({ status: 200, description: '导入成功' })
  async importPriceBase64(@Body() body: { fileData: string; fileName?: string }) {
    if (!body || !body.fileData) {
      throw new BadRequestException('请上传文件');
    }

    try {
      const buffer = Buffer.from(body.fileData, 'base64');
      return this.priceImportService.parseExcelFile(buffer);
    } catch (error) {
      throw new BadRequestException('文件格式错误');
    }
  }

  @Post('import/confirm')
  @ApiOperation({ summary: '确认导入价格数据' })
  @ApiResponse({ status: 200, description: '导入成功' })
  async confirmImport(@Body() body: { data: any[] }) {
    return this.priceStoreService.createBatch(body.data);
  }
}
