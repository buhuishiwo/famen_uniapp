import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Quotation } from './quotation.entity';

@Entity('quotation_items')
export class QuotationItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 36 })
  quotation_id: string;

  @Column({ type: 'int' })
  model_id: number;

  @Column({ type: 'varchar', length: 100 })
  valve_name: string;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'varchar', length: 20 })
  gate_plate: string;

  @Column({ type: 'varchar', length: 20 })
  rod_material: string;

  @Column({ type: 'varchar', length: 20, default: 'regular' })
  product_type: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int', default: 1 })
  min_order_qty: number;

  @Column({ type: 'boolean', default: false })
  branding: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  branding_fee: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_price: number;

  @ManyToOne(() => Quotation)
  @JoinColumn({ name: 'quotation_id' })
  quotation: Quotation;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}