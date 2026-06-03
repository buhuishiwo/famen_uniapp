import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ValveModel } from './valve-model.entity';

@Entity('price_table')
export class PriceTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  model_id: number;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  manual_price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  pneumatic_price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  electric_price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  gear_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  gate_304_diff: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  gate_316_diff: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  rod_304_diff: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  rod_316_diff: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  branding_fee: number;

  @Column({ type: 'int', default: 1 })
  min_order_qty: number;

  @Column({ type: 'varchar', length: 20, default: 'enabled' })
  status: string;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @ManyToOne(() => ValveModel)
  @JoinColumn({ name: 'model_id' })
  model: ValveModel;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}