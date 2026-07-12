// 数据迁移云函数
const cloudbase = require('@cloudbase/node-sdk');
const bcrypt = require('bcryptjs');

const ENV_ID = 'cloud1-d2g6k45v21dd52696';
const app = cloudbase.init({ env: ENV_ID });
const rdb = app.rdb();

exports.main = async (event, context) => {
  const { action } = event;
  console.log('migration action:', action);

  try {
    switch (action) {
      case 'createDefaultUser':
        return await createDefaultUser();
      case 'test':
        return { success: true, message: '云函数部署成功！环境: ' + ENV_ID };
      case 'testDb':
        return await testDb();
      default:
        return { success: false, message: '未知操作: ' + action };
    }
  } catch (error) {
    console.error('Migration错误:', error);
    return { success: false, message: error.message || '服务器错误' };
  }
};

// 测试数据库连接
async function testDb() {
  try {
    const { data, error } = await rdb.from('users').select('*').limit(1);
    if (error) return { success: false, message: '数据库查询失败: ' + error.message };
    return { success: true, message: '数据库连接成功！', data: data ? data.length : 0 };
  } catch (e) {
    return { success: false, message: '数据库连接异常: ' + e.message };
  }
}

// 创建默认管理员用户
async function createDefaultUser() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 6);

    const { data: existUsers, error: existError } = await rdb.from('users').select('id').eq('username', 'admin');

    if (existError) {
      return { success: false, message: '查询用户失败: ' + existError.message };
    }

    if (!existUsers || existUsers.length === 0) {
      const { error: insertError } = await rdb.from('users').insert({
        _openid: 'admin',
        username: 'admin',
        password: hashedPassword,
        nickname: '系统管理员',
        email: '',
        phone: '',
        role: 'admin',
        status: 'active'
      });

      if (insertError) {
        return { success: false, message: '创建用户失败: ' + insertError.message };
      }

      return { success: true, message: '默认管理员用户已创建: admin / admin123' };
    } else {
      const { error: updateError } = await rdb.from('users').update({
        password: hashedPassword
      }).eq('id', existUsers[0].id);

      if (updateError) {
        return { success: false, message: '更新密码失败: ' + updateError.message };
      }

      return { success: true, message: '默认管理员用户密码已更新: admin / admin123' };
    }
  } catch (e) {
    return { success: false, message: '操作失败: ' + e.message };
  }
}
