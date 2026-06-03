import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuotationDto } from '../dto/quotation.dto';

export interface QuotationItem {
  id: string;
  valveName: string;
  spec: number;
  gatePlate: string;
  rodMaterial: string;
  quantity: number;
  branding: boolean;
  productType?: string;
  unitPrice: number;
  totalPrice: number;
  brandingFee: number;
  minOrderQty: number;
}

export interface Quotation {
  id: string;
  customerName?: string;
  note?: string;
  paymentMethod?: string;
  packaging?: string;
  quoter?: string;
  quoterPhone?: string;
  validity?: string;
  status: string;
  totalAmount: number;
  items: QuotationItem[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class QuotationMemoryService {
  private quotations: Map<string, Quotation> = new Map();

  async create(createDto: CreateQuotationDto): Promise<Quotation> {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    const items: QuotationItem[] = createDto.items.map((item, index) => ({
      id: `item-${id}-${index}`,
      ...item,
      unitPrice: this.calculatePrice(item),
      brandingFee: item.branding ? 25 : 0,
      minOrderQty: this.getMinOrderQty(item.spec),
      totalPrice: 0,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    items.forEach(item => {
      item.totalPrice = item.unitPrice * item.quantity;
    });

    const quotation: Quotation = {
      id,
      customerName: createDto.customerName,
      note: createDto.note,
      paymentMethod: createDto.paymentMethod,
      packaging: createDto.packaging,
      quoter: createDto.quoter,
      quoterPhone: createDto.quoterPhone,
      validity: createDto.validity,
      status: 'draft',
      totalAmount,
      items,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.quotations.set(id, quotation);
    return quotation;
  }

  async findAll(page: number = 1, limit: number = 10, status?: string): Promise<{ data: Quotation[]; total: number }> {
    let allQuotations = Array.from(this.quotations.values());
    
    if (status) {
      allQuotations = allQuotations.filter(q => q.status === status);
    }

    const total = allQuotations.length;
    const start = (page - 1) * limit;
    const data = allQuotations.slice(start, start + limit);

    return { data, total };
  }

  async findOne(id: string): Promise<Quotation> {
    const quotation = this.quotations.get(id);
    if (!quotation) {
      throw new NotFoundException('报价单不存在');
    }
    return quotation;
  }

  async update(id: string, updateDto: Partial<Quotation>): Promise<Quotation> {
    const existing = this.quotations.get(id);
    if (!existing) {
      throw new NotFoundException('报价单不存在');
    }

    const updated: Quotation = {
      ...existing,
      ...updateDto,
      updatedAt: new Date(),
    };

    this.quotations.set(id, updated);
    return updated;
  }

  async remove(id: string): Promise<void> {
    if (!this.quotations.has(id)) {
      throw new NotFoundException('报价单不存在');
    }
    this.quotations.delete(id);
  }

  private calculatePrice(item: { spec: number; gatePlate: string; rodMaterial: string; productType?: string }): number {
    const basePrices: Record<number, number> = {
      50: 375, 65: 400, 80: 430, 100: 480, 125: 600,
      150: 765, 200: 965, 250: 1365, 300: 2165, 350: 2685,
      400: 2845, 450: 3995, 500: 5145, 600: 7940, 700: 10740,
      800: 13275, 900: 17265, 1000: 21165,
    };

    let price = basePrices[item.spec] || 500;

    if (item.gatePlate === '316') {
      price += 100;
    }

    if (item.rodMaterial === '304' || item.rodMaterial === '316') {
      price += 100;
    }

    if (item.productType === '新品') {
      price *= 1.3;
    }

    return Math.round(price);
  }

  private getMinOrderQty(spec: number): number {
    if (spec >= 50 && spec <= 200) return 50;
    if (spec >= 250 && spec <= 400) return 30;
    if (spec >= 450 && spec <= 600) return 6;
    return 2;
  }
}
