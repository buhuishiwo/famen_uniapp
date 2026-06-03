import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Quotation } from '../entities/quotation.entity';
import { QuotationItem } from '../entities/quotation-item.entity';
import { ValveModel } from '../entities/valve-model.entity';
import { PriceCalculationService, QuotationItemInput } from './price-calculation.service';
import { CreateQuotationDto, UpdateQuotationDto } from '../dto/quotation.dto';

@Injectable()
export class QuotationService {
  constructor(
    @InjectRepository(Quotation)
    private quotationRepository: Repository<Quotation>,
    @InjectRepository(QuotationItem)
    private quotationItemRepository: Repository<QuotationItem>,
    @InjectRepository(ValveModel)
    private valveModelRepository: Repository<ValveModel>,
    private priceCalculationService: PriceCalculationService,
  ) {}

  async create(createQuotationDto: CreateQuotationDto) {
    const quotationId = uuidv4();

    const itemsInput: QuotationItemInput[] = createQuotationDto.items.map(item => ({
      valveName: item.valveName,
      spec: item.spec,
      gatePlate: item.gatePlate,
      rodMaterial: item.rodMaterial,
      quantity: item.quantity,
      branding: item.branding,
      productType: item.productType,
    }));

    const { results, totalAmount, errors } = await this.priceCalculationService.calculateBatchPrices(itemsInput);

    if (errors.length > 0) {
      return {
        success: false,
        message: '部分项目计算失败',
        errors,
      };
    }

    const quotation = this.quotationRepository.create({
      id: quotationId,
      customer_name: createQuotationDto.customerName,
      note: createQuotationDto.note,
      payment_method: createQuotationDto.paymentMethod,
      packaging: createQuotationDto.packaging,
      quoter: createQuotationDto.quoter,
      quoter_phone: createQuotationDto.quoterPhone,
      validity: createQuotationDto.validity,
      total_amount: totalAmount,
      status: 'draft',
    });

    await this.quotationRepository.save(quotation);

    for (const result of results) {
      const model = await this.valveModelRepository.findOne({
        where: { name: result.valveName },
      });

      const item = this.quotationItemRepository.create({
        quotation_id: quotationId,
        model_id: model.id,
        valve_name: result.valveName,
        size: result.spec,
        gate_plate: result.gatePlate,
        rod_material: result.rodMaterial,
        product_type: createQuotationDto.items.find(i => i.valveName === result.valveName)?.productType || 'regular',
        quantity: result.quantity,
        min_order_qty: result.minOrderQty,
        branding: result.branding,
        branding_fee: result.brandingFee,
        unit_price: result.unitPrice,
        total_price: result.totalPrice,
      });

      await this.quotationItemRepository.save(item);
    }

    return {
      success: true,
      data: {
        id: quotationId,
        customerName: quotation.customer_name,
        totalAmount,
        itemCount: results.length,
        status: quotation.status,
        createdAt: quotation.created_at,
      },
    };
  }

  async findAll(page: number = 1, limit: number = 10, status?: string) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [quotations, total] = await this.quotationRepository.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      success: true,
      data: {
        list: quotations.map(q => ({
          id: q.id,
          customerName: q.customer_name,
          totalAmount: q.total_amount,
          itemCount: 0,
          status: q.status,
          createdAt: q.created_at,
        })),
        pagination: {
          page,
          limit,
          total,
        },
      },
    };
  }

  async findOne(id: string) {
    const quotation = await this.quotationRepository.findOne({
      where: { id },
    });

    if (!quotation) {
      throw new NotFoundException('报价单不存在');
    }

    const items = await this.quotationItemRepository.find({
      where: { quotation_id: id },
      order: { created_at: 'ASC' },
    });

    return {
      success: true,
      data: {
        id: quotation.id,
        customerName: quotation.customer_name,
        note: quotation.note,
        paymentMethod: quotation.payment_method,
        packaging: quotation.packaging,
        quoter: quotation.quoter,
        quoterPhone: quotation.quoter_phone,
        validity: quotation.validity,
        totalAmount: quotation.total_amount,
        status: quotation.status,
        createdAt: quotation.created_at,
        updatedAt: quotation.updated_at,
        items: items.map(item => ({
          id: item.id,
          valveName: item.valve_name,
          spec: item.size,
          gatePlate: item.gate_plate,
          rodMaterial: item.rod_material,
          productType: item.product_type,
          quantity: item.quantity,
          minOrderQty: item.min_order_qty,
          branding: item.branding,
          brandingFee: item.branding_fee,
          unitPrice: item.unit_price,
          totalPrice: item.total_price,
        })),
      },
    };
  }

  async update(id: string, updateQuotationDto: UpdateQuotationDto) {
    const quotation = await this.quotationRepository.findOne({
      where: { id },
    });

    if (!quotation) {
      throw new NotFoundException('报价单不存在');
    }

    Object.assign(quotation, {
      customer_name: updateQuotationDto.customerName,
      note: updateQuotationDto.note,
      payment_method: updateQuotationDto.paymentMethod,
      packaging: updateQuotationDto.packaging,
      quoter: updateQuotationDto.quoter,
      quoter_phone: updateQuotationDto.quoterPhone,
      validity: updateQuotationDto.validity,
      status: updateQuotationDto.status,
    });

    await this.quotationRepository.save(quotation);

    return {
      success: true,
      data: {
        id: quotation.id,
        customerName: quotation.customer_name,
        status: quotation.status,
        updatedAt: quotation.updated_at,
      },
    };
  }

  async remove(id: string) {
    const quotation = await this.quotationRepository.findOne({
      where: { id },
    });

    if (!quotation) {
      throw new NotFoundException('报价单不存在');
    }

    await this.quotationItemRepository.delete({ quotation_id: id });
    await this.quotationRepository.delete(id);

    return {
      success: true,
      message: '删除成功',
    };
  }
}