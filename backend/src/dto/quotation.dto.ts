import { ApiProperty } from '@nestjs/swagger';

export class QuotationItemDto {
  @ApiProperty({ description: '阀门型号' })
  valveName: string;

  @ApiProperty({ description: '规格DN' })
  spec: number;

  @ApiProperty({ description: '闸板材质', enum: ['304', '316'] })
  gatePlate: string;

  @ApiProperty({ description: '阀杆材质', enum: ['2Cr13', '304', '316'] })
  rodMaterial: string;

  @ApiProperty({ description: '数量' })
  quantity: number;

  @ApiProperty({ description: '是否磨标' })
  branding: boolean;

  @ApiProperty({ description: '产品类型', required: false })
  productType?: string;
}

export class CreateQuotationDto {
  @ApiProperty({ description: '客户名称', required: false })
  customerName?: string;

  @ApiProperty({ description: '备注信息', required: false })
  note?: string;

  @ApiProperty({ description: '付款方式', required: false })
  paymentMethod?: string;

  @ApiProperty({ description: '包装方式', required: false })
  packaging?: string;

  @ApiProperty({ description: '报价人', required: false })
  quoter?: string;

  @ApiProperty({ description: '联系电话', required: false })
  quoterPhone?: string;

  @ApiProperty({ description: '有效期', required: false })
  validity?: string;

  @ApiProperty({ description: '报价明细项', type: [QuotationItemDto] })
  items: QuotationItemDto[];
}

export class UpdateQuotationDto {
  @ApiProperty({ description: '客户名称', required: false })
  customerName?: string;

  @ApiProperty({ description: '备注信息', required: false })
  note?: string;

  @ApiProperty({ description: '付款方式', required: false })
  paymentMethod?: string;

  @ApiProperty({ description: '包装方式', required: false })
  packaging?: string;

  @ApiProperty({ description: '报价人', required: false })
  quoter?: string;

  @ApiProperty({ description: '联系电话', required: false })
  quoterPhone?: string;

  @ApiProperty({ description: '有效期', required: false })
  validity?: string;

  @ApiProperty({ description: '状态', enum: ['draft', 'approved', 'sent'], required: false })
  status?: string;
}