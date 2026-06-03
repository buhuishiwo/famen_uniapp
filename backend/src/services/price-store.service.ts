import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceTable } from '../entities/price-table.entity';
import { ValveModel } from '../entities/valve-model.entity';
import { ProductSeries } from '../entities/product-series.entity';

export interface PriceData {
  id: string;
  seriesName: string;
  valveName: string;
  size: number;
  manualPrice: number;
  pneumaticPrice: number;
  electricPrice: number;
  gearPrice: number;
  gatePlate304Diff: number;
  gatePlate316Diff: number;
  rod304Diff: number;
  rod316Diff: number;
  brandingFee: number;
  minOrderQty: number;
  status: string;
  remark: string;
  createdAt: Date;
}

@Injectable()
export class PriceStoreService {
  constructor(
    @InjectRepository(PriceTable)
    private priceTableRepository: Repository<PriceTable>,
    @InjectRepository(ValveModel)
    private valveModelRepository: Repository<ValveModel>,
    @InjectRepository(ProductSeries)
    private productSeriesRepository: Repository<ProductSeries>,
  ) {}

  async findAll(): Promise<PriceData[]> {
    const prices = await this.priceTableRepository
      .createQueryBuilder('pt')
      .leftJoinAndSelect('pt.model', 'vm')
      .leftJoinAndSelect('vm.series', 'ps')
      .where('pt.status = :status', { status: 'enabled' })
      .getMany();

    return prices.map(this.transformToPriceData);
  }

  async findOne(id: string): Promise<PriceData | undefined> {
    const price = await this.priceTableRepository
      .createQueryBuilder('pt')
      .leftJoinAndSelect('pt.model', 'vm')
      .leftJoinAndSelect('vm.series', 'ps')
      .where('pt.id = :id', { id })
      .getOne();

    return price ? this.transformToPriceData(price) : undefined;
  }

  async create(priceData: Omit<PriceData, 'id' | 'createdAt'>): Promise<PriceData> {
    const series = await this.productSeriesRepository.findOne({
      where: { name: priceData.seriesName },
    });

    if (!series) {
      throw new Error(`产品系列 ${priceData.seriesName} 不存在`);
    }

    const model = await this.valveModelRepository.findOne({
      where: { series_id: series.id, name: priceData.valveName },
    });

    if (!model) {
      throw new Error(`阀门型号 ${priceData.valveName} 不存在`);
    }

    const price = this.priceTableRepository.create({
      model_id: model.id,
      size: priceData.size,
      manual_price: priceData.manualPrice,
      pneumatic_price: priceData.pneumaticPrice,
      electric_price: priceData.electricPrice,
      gear_price: priceData.gearPrice,
      gate_304_diff: priceData.gatePlate304Diff,
      gate_316_diff: priceData.gatePlate316Diff,
      rod_304_diff: priceData.rod304Diff,
      rod_316_diff: priceData.rod316Diff,
      branding_fee: priceData.brandingFee,
      min_order_qty: priceData.minOrderQty,
      status: priceData.status,
      remark: priceData.remark,
    });

    const saved = await this.priceTableRepository.save(price);
    return this.transformToPriceData(saved);
  }

  async createBatch(items: Omit<PriceData, 'id' | 'createdAt'>[]): Promise<{ successCount: number; failedCount: number }> {
    let successCount = 0;
    let failedCount = 0;

    for (const item of items) {
      try {
        await this.upsert(item);
        successCount++;
      } catch (error) {
        console.error('Upsert failed:', error.message);
        failedCount++;
      }
    }

    return { successCount, failedCount };
  }

  async upsert(priceData: Omit<PriceData, 'id' | 'createdAt'>): Promise<PriceData> {
    const series = await this.productSeriesRepository.findOne({
      where: { name: priceData.seriesName },
    });

    if (!series) {
      throw new Error(`产品系列 ${priceData.seriesName} 不存在`);
    }

    const model = await this.valveModelRepository.findOne({
      where: { series_id: series.id, name: priceData.valveName },
    });

    if (!model) {
      throw new Error(`阀门型号 ${priceData.valveName} 不存在`);
    }

    // 检查是否已存在相同记录
    const existing = await this.priceTableRepository.findOne({
      where: { model_id: model.id, size: priceData.size },
    });

    if (existing) {
      // 更新现有记录
      existing.manual_price = priceData.manualPrice;
      existing.pneumatic_price = priceData.pneumaticPrice;
      existing.electric_price = priceData.electricPrice;
      existing.gear_price = priceData.gearPrice;
      existing.gate_304_diff = priceData.gatePlate304Diff;
      existing.gate_316_diff = priceData.gatePlate316Diff;
      existing.rod_304_diff = priceData.rod304Diff;
      existing.rod_316_diff = priceData.rod316Diff;
      existing.branding_fee = priceData.brandingFee;
      existing.min_order_qty = priceData.minOrderQty;
      existing.status = priceData.status;
      existing.remark = priceData.remark;

      const updated = await this.priceTableRepository.save(existing);
      return this.transformToPriceData(updated);
    } else {
      // 创建新记录
      const price = this.priceTableRepository.create({
        model_id: model.id,
        size: priceData.size,
        manual_price: priceData.manualPrice,
        pneumatic_price: priceData.pneumaticPrice,
        electric_price: priceData.electricPrice,
        gear_price: priceData.gearPrice,
        gate_304_diff: priceData.gatePlate304Diff,
        gate_316_diff: priceData.gatePlate316Diff,
        rod_304_diff: priceData.rod304Diff,
        rod_316_diff: priceData.rod316Diff,
        branding_fee: priceData.brandingFee,
        min_order_qty: priceData.minOrderQty,
        status: priceData.status,
        remark: priceData.remark,
      });

      const saved = await this.priceTableRepository.save(price);
      return this.transformToPriceData(saved);
    }
  }

  async update(id: string, updateData: Partial<PriceData>): Promise<PriceData | undefined> {
    const price = await this.priceTableRepository.findOne({ where: { id: parseInt(id) } });
    if (!price) return undefined;

    if (updateData.manualPrice !== undefined) price.manual_price = updateData.manualPrice;
    if (updateData.pneumaticPrice !== undefined) price.pneumatic_price = updateData.pneumaticPrice;
    if (updateData.electricPrice !== undefined) price.electric_price = updateData.electricPrice;
    if (updateData.gearPrice !== undefined) price.gear_price = updateData.gearPrice;
    if (updateData.brandingFee !== undefined) price.branding_fee = updateData.brandingFee;
    if (updateData.minOrderQty !== undefined) price.min_order_qty = updateData.minOrderQty;
    if (updateData.status !== undefined) price.status = updateData.status;
    if (updateData.remark !== undefined) price.remark = updateData.remark;

    const updated = await this.priceTableRepository.save(price);
    return this.transformToPriceData(updated);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.priceTableRepository.delete(id);
    return result.affected > 0;
  }

  async clear(): Promise<void> {
    await this.priceTableRepository.clear();
  }

  async count(): Promise<number> {
    return this.priceTableRepository.count();
  }

  async findBySeries(seriesName: string): Promise<PriceData[]> {
    const series = await this.productSeriesRepository.findOne({
      where: { name: seriesName },
    });

    if (!series) {
      return [];
    }

    const prices = await this.priceTableRepository
      .createQueryBuilder('pt')
      .leftJoinAndSelect('pt.model', 'vm')
      .leftJoinAndSelect('vm.series', 'ps')
      .where('ps.id = :seriesId', { seriesId: series.id })
      .andWhere('pt.status = :status', { status: 'enabled' })
      .getMany();

    return prices.map(this.transformToPriceData);
  }

  async findBySize(size: number): Promise<PriceData[]> {
    const prices = await this.priceTableRepository
      .createQueryBuilder('pt')
      .leftJoinAndSelect('pt.model', 'vm')
      .leftJoinAndSelect('vm.series', 'ps')
      .where('pt.size = :size', { size })
      .andWhere('pt.status = :status', { status: 'enabled' })
      .getMany();

    return prices.map(this.transformToPriceData);
  }

  private transformToPriceData(price: PriceTable): PriceData {
    return {
      id: price.id.toString(),
      seriesName: price.model?.series?.name || '',
      valveName: price.model?.name || '',
      size: price.size,
      manualPrice: price.manual_price,
      pneumaticPrice: price.pneumatic_price,
      electricPrice: price.electric_price,
      gearPrice: price.gear_price,
      gatePlate304Diff: price.gate_304_diff,
      gatePlate316Diff: price.gate_316_diff,
      rod304Diff: price.rod_304_diff,
      rod316Diff: price.rod_316_diff,
      brandingFee: price.branding_fee,
      minOrderQty: price.min_order_qty,
      status: price.status,
      remark: price.remark || '',
      createdAt: price.created_at,
    };
  }

  // 获取所有产品系列
  async getAllSeries(): Promise<ProductSeries[]> {
    return this.productSeriesRepository.find();
  }

  // 根据系列获取阀门型号
  async getModelsBySeries(seriesId: number): Promise<ValveModel[]> {
    return this.valveModelRepository.find({
      where: { series_id: seriesId },
      relations: ['series'],
    });
  }

  // 根据系列名称获取阀门型号
  async getModelsBySeriesName(seriesName: string): Promise<ValveModel[]> {
    const series = await this.productSeriesRepository.findOne({
      where: { name: seriesName },
    });

    if (!series) {
      return [];
    }

    return this.valveModelRepository.find({
      where: { series_id: series.id },
      relations: ['series'],
    });
  }
}
