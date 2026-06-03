import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';

export interface ParsedPriceRow {
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
}

export interface ImportError {
  rowIndex: number;
  error: string;
}

export interface ImportResult {
  success: boolean;
  message: string;
  data: {
    rowsCount: number;
    successCount: number;
    failedRows: ImportError[];
    previewData: ParsedPriceRow[];
  };
}

@Injectable()
export class PriceImportService {
  async parseExcelFile(buffer: Buffer): Promise<ImportResult> {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as (string | number | null)[][];

      if (!data || data.length < 2) {
        throw new BadRequestException('Excel文件为空或格式不正确');
      }

      const headers = data[0];
      if (!headers || !Array.isArray(headers)) {
        throw new BadRequestException('Excel表头格式不正确');
      }

      const expectedHeaders = [
        '产品系列', '阀门型号', '规格DN', '手动价格', '气动价格',
        '电装价格', '伞齿轮价格', '304闸板差价', '316闸板差价',
        '304阀杆差价', '316阀杆差价', '磨标费', '起订量', '状态', '备注'
      ];

      const headerValidation = this.validateHeaders(headers, expectedHeaders);
      if (!headerValidation.valid) {
        throw new BadRequestException(`表头格式错误: ${headerValidation.missing.join(', ')}`);
      }

      const parsedRows: ParsedPriceRow[] = [];
      const failedRows: ImportError[] = [];
      let successCount = 0;

      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0 || !row[0]) continue;

        try {
          const parsedRow = this.parseRow(row, i + 1);
          parsedRows.push(parsedRow);
          successCount++;
        } catch (error) {
          failedRows.push({
            rowIndex: i + 1,
            error: error.message || String(error),
          });
        }
      }

      return {
        success: true,
        message: '文件解析成功',
        data: {
          rowsCount: data.length - 1,
          successCount,
          failedRows,
          previewData: parsedRows,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`文件解析失败: ${error.message || String(error)}`);
    }
  }

  private validateHeaders(headers: any[], expectedHeaders: string[]): { valid: boolean; missing: string[] } {
    const missing = expectedHeaders.filter(h => !headers.includes(h));
    return {
      valid: missing.length === 0,
      missing,
    };
  }

  private parseRow(row: any[], rowIndex: number): ParsedPriceRow {
    const getCellValue = (index: number, defaultValue: any = null) => {
      const value = row[index];
      return value !== undefined && value !== null && value !== '' ? value : defaultValue;
    };

    const size = parseInt(getCellValue(2));
    if (isNaN(size) || size < 50 || size > 2000) {
      throw new Error(`规格DN必须为50-2000之间的整数`);
    }

    const minOrderQty = parseInt(getCellValue(12));
    if (isNaN(minOrderQty) || minOrderQty < 1) {
      throw new Error(`起订量必须为大于0的整数`);
    }

    return {
      seriesName: getCellValue(0),
      valveName: getCellValue(1),
      size,
      manualPrice: parseFloat(getCellValue(3, 0)) || 0,
      pneumaticPrice: parseFloat(getCellValue(4, 0)) || 0,
      electricPrice: parseFloat(getCellValue(5, 0)) || 0,
      gearPrice: parseFloat(getCellValue(6, 0)) || 0,
      gatePlate304Diff: parseFloat(getCellValue(7, 0)) || 0,
      gatePlate316Diff: parseFloat(getCellValue(8, 0)) || 0,
      rod304Diff: parseFloat(getCellValue(9, 0)) || 0,
      rod316Diff: parseFloat(getCellValue(10, 0)) || 0,
      brandingFee: parseFloat(getCellValue(11, 0)) || 0,
      minOrderQty,
      status: getCellValue(13, 'enabled'),
      remark: getCellValue(14, ''),
    };
  }
}
