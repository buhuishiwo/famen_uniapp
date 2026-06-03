import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('quotations')
export class Quotation {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  customer_name: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  payment_method: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  packaging: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  quoter: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  quoter_phone: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  validity: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_amount: number;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}