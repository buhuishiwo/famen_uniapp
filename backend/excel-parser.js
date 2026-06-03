const XLSX = require('xlsx');
const path = require('path');

/**
 * Excel解析器模块
 * 支持空列检测，当读取到空列时自动判定为该列数据不更新
 */
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
   * @param {array} rawData - 原始数据（二维数组）
   * @param {object} options - 解析选项
   * @returns {object} 工作表解析结果
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

    // 提取表头
    const headers = rawData[0];
    
    // 检测空列
    const { emptyCols, dataCols } = this.detectEmptyColumns(rawData);
    
    result.emptyCols = emptyCols;
    result.dataCols = dataCols;
    result.headers = headers.map((header, index) => ({
      index,
      name: this.normalizeValue(header),
      isEmpty: emptyCols.includes(index),
      hasData: dataCols.includes(index)
    }));

    // 如果忽略空列，只保留有数据的列
    let activeCols = ignoreEmptyCols ? dataCols : headers.map((_, i) => i);
    
    // 解析数据行
    for (let rowIndex = 1; rowIndex < rawData.length; rowIndex++) {
      const rawRow = rawData[rowIndex];
      const rowData = {};
      const rowValues = [];
      const skippedFields = [];
      const hasData = this.rowHasData(rawRow);

      if (!hasData) {
        continue;
      }

      activeCols.forEach((colIndex) => {
        const header = headers[colIndex];
        const value = rawRow[colIndex];
        const normalizedHeader = this.normalizeValue(header);
        const normalizedValue = this.normalizeValue(value);
        
        // 如果列是空列且忽略空列，则跳过
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
        // 记录被跳过的空列
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
   * @param {array} data - 二维数组数据
   * @returns {object} { emptyCols, dataCols }
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
      
      // 跳过表头，检查数据行
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
   * @param {array} row - 行数据
   * @returns {boolean}
   */
  static rowHasData(row) {
    if (!Array.isArray(row)) return false;
    return row.some(cell => !this.isEmptyValue(cell));
  }

  /**
   * 判断值是否为空
   * @param {any} value - 单元格值
   * @returns {boolean}
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
   * @param {any} value - 原始值
   * @returns {any} 标准化后的值
   */
  static normalizeValue(value) {
    if (this.isEmptyValue(value)) {
      return null;
    }
    
    if (typeof value === 'string') {
      const trimmed = value.trim();
      // 处理数字字符串
      if (/^\d+(\.\d+)?$/.test(trimmed)) {
        const num = parseFloat(trimmed);
        if (!isNaN(num)) {
          return num;
        }
      }
      return trimmed;
    }
    
    // 处理数字（去除浮点误差）
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
   * @param {object} parsedSheet - 解析后的工作表数据
   * @param {array} requiredFields - 必填字段列表
   * @returns {object} 更新数据
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

      // 检查必填字段
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

      // 只收集有数据的列（跳过空列）
      Object.keys(row.data).forEach((key) => {
        const fieldData = row.data[key];
        // 如果字段被跳过（空列）且我们要忽略空列，则不包含
        if (fieldData.skipped) {
          return;
        }
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
   * 对比数据差异（用于增量更新）
   * @param {array} sourceData - 源数据
   * @param {array} targetData - 目标数据
   * @param {string} keyField - 主键字段
   * @returns {object} 差异结果
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
      added: [],      // 新增
      updated: [],    // 更新
      deleted: [],    // 删除
      unchanged: [],  // 无变化
      conflicts: []   // 冲突
    };

    // 检查新增和更新
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

    // 检查删除
    targetMap.forEach((targetRow, key) => {
      if (!sourceMap.has(key)) {
        changes.deleted.push({ key, row: targetRow });
      }
    });

    return changes;
  }

  /**
   * 对比单行数据差异
   * @param {object} source - 源行
   * @param {object} target - 目标行
   * @returns {object} 差异结果
   */
  static compareRow(source, target) {
    const changes = [];
    const updatedFields = [];
    
    const allKeys = new Set([...Object.keys(source), ...Object.keys(target)]);
    
    allKeys.forEach(key => {
      const sourceValue = source[key];
      const targetValue = target[key];
      
      // 如果源值为空，则不更新（保持原值）
      if (this.isEmptyValue(sourceValue)) {
        return;
      }
      
      // 如果值不同，则记录变更
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
   * 格式化解析结果为可读格式
   * @param {object} result - 解析结果
   * @returns {string} 格式化的字符串
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

// 如果直接运行此文件，则执行示例
if (require.main === module) {
  const filePath = path.join(__dirname, '../报价更新正式生产版模板.xlsx');
  
  console.log('=== Excel解析器示例 ===\n');
  
  // 示例1: 基本解析（忽略空列）
  console.log('【示例1】基本解析（忽略空列）');
  const result1 = ExcelParser.parse(filePath, {
    ignoreEmptyCols: true,
    returnEmptyCols: false
  });
  console.log(ExcelParser.formatResult(result1));
  
  // 示例2: 保留空列但标记
  console.log('【示例2】保留空列但标记');
  const result2 = ExcelParser.parse(filePath, {
    ignoreEmptyCols: false,
    returnEmptyCols: true
  });
  
  if (result2.success && result2.sheets.length > 0) {
    const sheet = result2.sheets[0];
    console.log(`工作表: ${sheet.sheetName}`);
    console.log(`空列: ${sheet.emptyCols.length} 列`);
    console.log(`数据列: ${sheet.dataCols.length} 列`);
    console.log('\n表头信息:');
    sheet.headers.forEach(h => {
      console.log(`  [${h.index}] ${h.name} - ${h.isEmpty ? '空列' : '有数据'}`);
    });
  }
  
  // 示例3: 生成更新数据
  console.log('\n【示例3】生成更新数据');
  if (result1.success && result1.sheets.length > 0) {
    const updateData = ExcelParser.generateUpdateData(result1.sheets[0], ['型号', '尺寸']);
    console.log(`有效数据行: ${updateData.rows.length}`);
    console.log(`跳过的列: ${updateData.skippedColumns.join(', ')}`);
    console.log(`更新的列: ${updateData.updatedColumns.join(', ')}`);
  }
}
