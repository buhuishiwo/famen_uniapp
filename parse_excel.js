/**
 * Excel解析器模块 - 支持空列检测和智能更新
 * 当读取到空列时，自动判定为该列数据不更新
 */

const XLSX = require('xlsx');
const path = require('path');

class ExcelParser {
  /**
   * 解析Excel文件
   * @param {string} filePath - Excel文件路径
   * @param {object} options - 解析选项
   * @param {boolean} options.ignoreEmptyCols - 是否忽略空列（默认true）
   * @param {boolean} options.returnEmptyCols - 是否返回空列标记（默认false）
   * @returns {object} 解析结果
   */
  static parse(filePath, options = {}) {
    const {
      ignoreEmptyCols = true,
      returnEmptyCols = false
    } = options;

    try {
      const workbook = XLSX.readFile(filePath);
      const result = {
        success: true,
        message: '解析成功',
        sheets: [],
        totalSheets: workbook.SheetNames.length
      };

      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
        const sheetResult = this.parseSheet(rawData, {
          sheetName,
          ignoreEmptyCols,
          returnEmptyCols
        });
        
        result.sheets.push(sheetResult);
      });

      return result;
    } catch (error) {
      return {
        success: false,
        message: `解析失败: ${error.message}`,
        error: error,
        sheets: [],
        totalSheets: 0
      };
    }
  }

  /**
   * 解析单个工作表
   */
  static parseSheet(rawData, options = {}) {
    const { sheetName, ignoreEmptyCols, returnEmptyCols } = options;
    const result = {
      sheetName,
      totalRows: rawData.length,
      totalCols: rawData.length > 0 ? rawData[0].length : 0,
      headers: [],
      rows: [],
      emptyCols: [],
      dataCols: [],
      skippedCols: []
    };

    if (rawData.length === 0) {
      result.message = '工作表为空';
      return result;
    }

    const headers = rawData[0];
    const { emptyCols, dataCols } = this.detectEmptyColumns(rawData);
    
    result.emptyCols = emptyCols;
    result.dataCols = dataCols;
    result.headers = headers.map((header, index) => ({
      index,
      name: this.normalizeValue(header),
      isEmpty: emptyCols.includes(index),
      hasData: dataCols.includes(index)
    }));

    let activeCols = ignoreEmptyCols ? dataCols : headers.map((_, i) => i);
    
    for (let rowIndex = 1; rowIndex < rawData.length; rowIndex++) {
      const rawRow = rawData[rowIndex];
      const rowData = {};
      const rowValues = [];
      const skippedFields = [];
      const hasData = this.rowHasData(rawRow);

      if (!hasData) continue;

      activeCols.forEach((colIndex) => {
        const header = headers[colIndex];
        const value = rawRow[colIndex];
        const normalizedHeader = this.normalizeValue(header);
        const normalizedValue = this.normalizeValue(value);
        
        if (ignoreEmptyCols && emptyCols.includes(colIndex)) {
          skippedFields.push(normalizedHeader);
          return;
        }

        rowData[normalizedHeader] = {
          value: normalizedValue,
          originalValue: value,
          colIndex,
          isEmpty: this.isEmptyValue(value),
          header: normalizedHeader
        };
        rowValues.push(normalizedValue);
      });

      if (returnEmptyCols) {
        emptyCols.forEach((colIndex) => {
          const header = headers[colIndex];
          const normalizedHeader = this.normalizeValue(header);
          rowData[normalizedHeader] = {
            value: null,
            originalValue: null,
            colIndex,
            isEmpty: true,
            header: normalizedHeader,
            skipped: true
          };
        });
      }

      result.rows.push({
        rowIndex,
        data: rowData,
        values: rowValues,
        skippedFields,
        hasData: rowValues.some(v => v !== null && v !== '')
      });
    }

    result.skippedCols = emptyCols.map(index => ({
      index,
      header: this.normalizeValue(headers[index])
    }));

    result.message = `解析完成，共 ${result.rows.length} 行数据，${emptyCols.length} 列空列被${ignoreEmptyCols ? '跳过' : '保留'}`;
    
    return result;
  }

  /**
   * 检测空列
   */
  static detectEmptyColumns(data) {
    if (data.length === 0) {
      return { emptyCols: [], dataCols: [] };
    }

    const headerRow = data[0];
    const totalCols = headerRow.length;
    const emptyCols = [];
    const dataCols = [];

    for (let colIndex = 0; colIndex < totalCols; colIndex++) {
      let hasData = false;
      
      for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
        const cellValue = data[rowIndex][colIndex];
        if (!this.isEmptyValue(cellValue)) {
          hasData = true;
          break;
        }
      }

      if (hasData) {
        dataCols.push(colIndex);
      } else {
        emptyCols.push(colIndex);
      }
    }

    return { emptyCols, dataCols };
  }

  /**
   * 判断行是否有数据
   */
  static rowHasData(row) {
    if (!Array.isArray(row)) return false;
    return row.some(cell => !this.isEmptyValue(cell));
  }

  /**
   * 判断值是否为空
   */
  static isEmptyValue(value) {
    return value === null || 
           value === undefined || 
           value === '' || 
           value === 'undefined' || 
           value === 'null' ||
           (typeof value === 'string' && value.trim() === '');
  }

  /**
   * 标准化值
   */
  static normalizeValue(value) {
    if (this.isEmptyValue(value)) {
      return null;
    }
    
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (/^\d+(\.\d+)?$/.test(trimmed)) {
        const num = parseFloat(trimmed);
        if (!isNaN(num)) {
          return num;
        }
      }
      return trimmed;
    }
    
    if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        return parseInt(value, 10);
      }
      return value;
    }
    
    return value;
  }

  /**
   * 生成更新数据（只包含非空列）
   */
  static generateUpdateData(parsedSheet, requiredFields = []) {
    const updateData = {
      success: true,
      rows: [],
      errors: [],
      skippedRows: [],
      updatedColumns: parsedSheet.dataCols.map(
        idx => parsedSheet.headers[idx]?.name || `列${idx}`
      ),
      skippedColumns: parsedSheet.skippedCols.map(col => col.header)
    };

    parsedSheet.rows.forEach((row) => {
      const rowData = {};
      const errors = [];

      requiredFields.forEach((field) => {
        const fieldData = row.data[field];
        if (!fieldData || fieldData.isEmpty || fieldData.value === null) {
          errors.push(`${field} 不能为空`);
        }
      });

      if (errors.length > 0) {
        updateData.errors.push({
          rowIndex: row.rowIndex,
          errors
        });
        updateData.skippedRows.push(row.rowIndex);
        return;
      }

      Object.keys(row.data).forEach((key) => {
        const fieldData = row.data[key];
        if (fieldData.skipped) return;
        rowData[key] = fieldData.value;
      });

      updateData.rows.push({
        rowIndex: row.rowIndex,
        data: rowData,
        originalRow: row
      });
    });

    updateData.message = `生成更新数据完成，共 ${updateData.rows.length} 行有效数据，${updateData.errors.length} 行错误`;
    
    return updateData;
  }

  /**
   * 对比数据差异（增量更新）
   */
  static compareData(sourceData, targetData, keyField) {
    const sourceMap = new Map();
    const targetMap = new Map();

    sourceData.forEach(row => {
      const key = row[keyField];
      if (key !== null && key !== undefined) {
        sourceMap.set(key, row);
      }
    });

    targetData.forEach(row => {
      const key = row[keyField];
      if (key !== null && key !== undefined) {
        targetMap.set(key, row);
      }
    });

    const changes = {
      added: [],
      updated: [],
      deleted: [],
      unchanged: [],
      conflicts: []
    };

    sourceMap.forEach((sourceRow, key) => {
      if (targetMap.has(key)) {
        const targetRow = targetMap.get(key);
        const diff = this.compareRow(sourceRow, targetRow);
        
        if (diff.hasChanges) {
          changes.updated.push({
            key,
            source: sourceRow,
            target: targetRow,
            changes: diff.changes,
            updatedFields: diff.updatedFields
          });
        } else {
          changes.unchanged.push({ key, row: sourceRow });
        }
      } else {
        changes.added.push({ key, row: sourceRow });
      }
    });

    targetMap.forEach((targetRow, key) => {
      if (!sourceMap.has(key)) {
        changes.deleted.push({ key, row: targetRow });
      }
    });

    return changes;
  }

  /**
   * 对比单行数据差异
   */
  static compareRow(source, target) {
    const changes = [];
    const updatedFields = [];
    
    const allKeys = new Set([...Object.keys(source), ...Object.keys(target)]);
    
    allKeys.forEach(key => {
      const sourceValue = source[key];
      const targetValue = target[key];
      
      if (this.isEmptyValue(sourceValue)) {
        return;
      }
      
      if (sourceValue !== targetValue) {
        changes.push({
          field: key,
          oldValue: targetValue,
          newValue: sourceValue
        });
        updatedFields.push(key);
      }
    });

    return {
      hasChanges: changes.length > 0,
      changes,
      updatedFields
    };
  }

  /**
   * 格式化解析结果
   */
  static formatResult(result) {
    if (!result.success) {
      return `❌ ${result.message}`;
    }

    let output = `✅ ${result.message}\n`;
    output += `📊 工作表数量: ${result.totalSheets}\n\n`;

    result.sheets.forEach((sheet, index) => {
      output += `--- 工作表 ${index + 1}: ${sheet.sheetName} ---\n`;
      output += `  总行数: ${sheet.totalRows}\n`;
      output += `  总列数: ${sheet.totalCols}\n`;
      output += `  数据行数: ${sheet.rows.length}\n`;
      output += `  空列数: ${sheet.emptyCols.length}\n`;
      
      if (sheet.emptyCols.length > 0) {
        output += `  空列索引: [${sheet.emptyCols.join(', ')}]\n`;
        output += `  空列表头: ${sheet.skippedCols.map(c => c.header).join(', ')}\n`;
      }
      
      output += `  ${sheet.message}\n\n`;
    });

    return output;
  }
}

// 导出模块
module.exports = ExcelParser;

// 直接运行时执行示例
if (require.main === module) {
  const filePath = path.join(__dirname, '报价更新正式生产版模板.xlsx');
  
  console.log('=== Excel解析器示例 ===\n');
  
  const result = ExcelParser.parse(filePath, {
    ignoreEmptyCols: true,
    returnEmptyCols: false
  });
  
  console.log(ExcelParser.formatResult(result));
  
  if (result.success && result.sheets.length > 0) {
    const sheet = result.sheets[0];
    const updateData = ExcelParser.generateUpdateData(sheet, ['型号', '尺寸']);
    
    console.log('\n【更新数据统计】');
    console.log(`有效数据行: ${updateData.rows.length}`);
    console.log(`跳过的列: ${updateData.skippedColumns.join(', ') || '无'}`);
    console.log(`更新的列: ${updateData.updatedColumns.join(', ')}`);
  }
}
