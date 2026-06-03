import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationController } from '../controllers/quotation.controller';
import { QuotationService } from '../services/quotation.service';
import { QuotationMemoryService } from '../services/quotation-memory.service';
import { PriceImportService } from '../services/price-import.service';
import { PriceStoreService } from '../services/price-store.service';
import { PriceCalculationService } from '../services/price-calculation.service';
import { Quotation } from '../entities/quotation.entity';
import { QuotationItem } from '../entities/quotation-item.entity';
import { ValveModel } from '../entities/valve-model.entity';
import { PriceTable } from '../entities/price-table.entity';
import { ProductSeries } from '../entities/product-series.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quotation, QuotationItem, ValveModel, PriceTable, ProductSeries]),
    MulterModule.register({
      dest: './uploads',
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  ],
  controllers: [QuotationController],
  providers: [
    QuotationService,
    QuotationMemoryService,
    PriceImportService,
    PriceStoreService,
    PriceCalculationService,
  ],
  exports: [
    QuotationService,
    QuotationMemoryService,
    PriceImportService,
    PriceStoreService,
    PriceCalculationService,
  ],
})
export class QuotationModule {}
