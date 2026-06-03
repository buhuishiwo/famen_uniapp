import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValveModel } from '../entities/valve-model.entity';
import { PriceTable } from '../entities/price-table.entity';

export interface QuotationItemInput {
  valveName: string;
  spec: number;
  gatePlate: string;
  rodMaterial: string;
  quantity: number;
  branding: boolean;
  productType?: string;
}

export interface CalculatedPrice {
  valveName: string;
  spec: number;
  gatePlate: string;
  rodMaterial: string;
  quantity: number;
  minOrderQty: number;
  branding: boolean;
  unitPrice: number;
  brandingFee: number;
  totalPrice: number;
}

@Injectable()
export class PriceCalculationService {
  constructor(
    @InjectRepository(ValveModel)
    private valveModelRepository: Repository<ValveModel>,
    @InjectRepository(PriceTable)
    private priceTableRepository: Repository<PriceTable>,
  ) {}

  async calculateItemPrice(item: QuotationItemInput): Promise<CalculatedPrice> {
    const model = await this.valveModelRepository.findOne({
      where: { name: item.valveName },
    });

    if (!model) {
      throw new NotFoundException(`阀门型号不存在: ${item.valveName}`);
    }

    const priceData = await this.priceTableRepository.findOne({
      where: { model_id: model.id, size: item.spec },
    });

    if (!priceData) {
      throw new NotFoundException(`价格数据不存在: ${item.valveName} DN${item.spec}`);
    }

    if (priceData.status !== 'enabled') {
      throw new BadRequestException(`该产品已禁用: ${item.valveName} DN${item.spec}`);
    }

    if (item.quantity < priceData.min_order_qty) {
      throw new BadRequestException(`起订量不足: ${item.valveName} DN${item.spec} 起订量为${priceData.min_order_qty}，当前数量${item.quantity}`);
    }

    const unitPrice = this.calculateUnitPrice(item, priceData);
    const brandingFee = item.branding ? priceData.branding_fee : 0;
    const totalPrice = (unitPrice + brandingFee) * item.quantity;

    return {
      valveName: item.valveName,
      spec: item.spec,
      gatePlate: item.gatePlate,
      rodMaterial: item.rodMaterial,
      quantity: item.quantity,
      minOrderQty: priceData.min_order_qty,
      branding: item.branding,
      unitPrice,
      brandingFee,
      totalPrice,
    };
  }

  async calculateBatchPrices(items: QuotationItemInput[]): Promise<{
    results: CalculatedPrice[];
    totalAmount: number;
    errors: Array<{ index: number; error: string }>;
  }> {
    const results: CalculatedPrice[] = [];
    const errors: Array<{ index: number; error: string }> = [];
    let totalAmount = 0;

    for (let i = 0; i < items.length; i++) {
      try {
        const calculated = await this.calculateItemPrice(items[i]);
        results.push(calculated);
        totalAmount += calculated.totalPrice;
      } catch (error) {
        errors.push({
          index: i + 1,
          error: error.message,
        });
      }
    }

    return { results, totalAmount, errors };
  }

  private calculateUnitPrice(item: QuotationItemInput, priceData: PriceTable): number {
    let basePrice = this.getBasePrice(item.valveName, priceData);

    basePrice += this.getGatePlateDiff(item.gatePlate, priceData);
    basePrice += this.getRodMaterialDiff(item.rodMaterial, priceData);

    return basePrice;
  }

  private getBasePrice(valveName: string, priceData: PriceTable): number {
    const name = valveName.toLowerCase();

    if (name.includes('气动')) {
      return priceData.pneumatic_price || 0;
    } else if (name.includes('电装')) {
      return priceData.electric_price || 0;
    } else if (name.includes('伞齿轮')) {
      return priceData.gear_price || 0;
    } else {
      return priceData.manual_price || 0;
    }
  }

  private getGatePlateDiff(gatePlate: string, priceData: PriceTable): number {
    if (gatePlate === '316') {
      return priceData.gate_316_diff || 0;
    }
    return priceData.gate_304_diff || 0;
  }

  private getRodMaterialDiff(rodMaterial: string, priceData: PriceTable): number {
    if (rodMaterial === '316') {
      return priceData.rod_316_diff || 0;
    } else if (rodMaterial === '304') {
      return priceData.rod_304_diff || 0;
    }
    return 0;
  }

  async validateItem(item: QuotationItemInput): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!item.valveName || item.valveName.trim() === '') {
      errors.push('阀门型号不能为空');
    }

    if (!item.spec || item.spec < 50 || item.spec > 2000) {
      errors.push('规格DN必须在50-2000之间');
    }

    if (!['304', '316'].includes(item.gatePlate)) {
      errors.push('闸板材质必须是304或316');
    }

    if (!['2Cr13', '304', '316'].includes(item.rodMaterial)) {
      errors.push('阀杆材质必须是2Cr13、304或316');
    }

    if (!item.quantity || item.quantity < 1) {
      errors.push('数量必须大于0');
    }

    if (item.quantity > 1000) {
      errors.push('单次数量不能超过1000');
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    try {
      await this.calculateItemPrice(item);
    } catch (error) {
      errors.push(error.message);
      return { valid: false, errors };
    }

    return { valid: true, errors: [] };
  }
}