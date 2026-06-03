import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProductSeries } from './product-series.entity';

@Entity('valve_models')
export class ValveModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  series_id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  type_code: string;

  @ManyToOne(() => ProductSeries)
  @JoinColumn({ name: 'series_id' })
  series: ProductSeries;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}