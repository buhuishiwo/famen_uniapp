// 用户认证云函数
const cloudbase = require('@cloudbase/node-sdk');
const bcrypt = require('bcryptjs');

const ENV_ID = 'cloud1-d2g6k45v21dd52696';
const app = cloudbase.init({ env: ENV_ID });
const rdb = app.rdb();

exports.main = async (event, context) => {
  const { action } = event;
  try {
    switch (action) {
      case 'login':          return await login(event);
      case 'register':       return await register(event);
      case 'getProfile':     return await getProfile(event);
      case 'getAllUsers':    return await getAllUsers();
      case 'updateUser':     return await updateUser(event);
      case 'changePassword': return await changePassword(event);
      case 'deleteUser':     return await deleteUser(event);
      default: return { success: false, message: '未知操作: ' + action };
    }
  } catch (error) {
    console.error('User函数错误:', error);
    return { success: false, message: error.message || '服务器错误' };
  }
};

// 登录
async function login(event) {
  const { username, password } = event;
  if (!username || !password) return { success: false, message: '用户名和密码不能为空' };

  const { data, error } = await rdb.from('users').select('*').eq('username', username);
  if (error) return { success: false, message: '数据库查询失败: ' + error.message };
  if (!data || data.length === 0) return { success: false, message: '用户名或密码错误' };

  const user = data[0];
  if (user.status !== 'active') return { success: false, message: '用户已被禁用' };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { success: false, message: '用户名或密码错误' };

  const { password: _, _openid: __, ...safeUser } = user;
  return { success: true, data: safeUser };
}

// 注册
async function register(event) {
  const { username, password, nickname, email, phone } = event;
  if (!username || !password) return { success: false, message: '用户名和密码不能为空' };
  if (password.length < 6) return { success: false, message: '密码长度不能少于6位' };

  const { data: exist, error: existErr } = await rdb.from('users').select('id').eq('username', username);
  if (existErr) return { success: false, message: '数据库查询失败: ' + existErr.message };
  if (exist && exist.length > 0) return { success: false, message: '用户名已存在' };

  const hashed = await bcrypt.hash(password, 6);
  const { data: inserted, error: insertErr } = await rdb.from('users').insert({
    _openid: 'user-' + username,
    username,
    password: hashed,
    nickname: nickname || username,
    email: email || '',
    phone: phone || '',
    role: 'user',
    status: 'active'
  });

  if (insertErr) return { success: false, message: '创建用户失败: ' + insertErr.message };

  return { success: true, data: { id: inserted?.[0]?.id, username, nickname: nickname || username } };
}

// 获取用户信息
async function getProfile(event) {
  const { id } = event;
  if (!id) return { success: false, message: '用户ID不能为空' };

  const { data, error } = await rdb.from('users').select('*').eq('id', id);
  if (error) return { success: false, message: '查询失败: ' + error.message };
  if (!data || data.length === 0) return { success: false, message: '用户不存在' };

  const { password: _, _openid: __, ...safeUser } = data[0];
  return { success: true, data: safeUser };
}

// 获取所有用户
async function getAllUsers() {
  const { data, error } = await rdb.from('users').select('id, username, nickname, email, phone, role, status, created_at').order('id');
  if (error) return { success: false, message: '查询失败: ' + error.message };
  return { success: true, data };
}

// 更新用户
async function updateUser(event) {
  const { id, nickname, email, phone, role, status } = event;
  if (!id) return { success: false, message: '用户ID不能为空' };

  const updateData = {};
  if (nickname !== undefined) updateData.nickname = nickname;
  if (email !== undefined) updateData.email = email;
  if (phone !== undefined) updateData.phone = phone;
  if (role !== undefined) updateData.role = role;
  if (status !== undefined) updateData.status = status;

  if (Object.keys(updateData).length > 0) {
    const { error } = await rdb.from('users').update(updateData).eq('id', id);
    if (error) return { success: false, message: '更新失败: ' + error.message };
  }

  return await getProfile({ id });
}

// 修改密码
async function changePassword(event) {
  const { id, oldPassword, newPassword } = event;
  if (!id || !oldPassword || !newPassword) return { success: false, message: '参数不完整' };
  if (newPassword.length < 6) return { success: false, message: '新密码长度不能少于6位' };

  const { data, error } = await rdb.from('users').select('password').eq('id', id);
  if (error) return { success: false, message: '查询失败: ' + error.message };
  if (!data || data.length === 0) return { success: false, message: '用户不存在' };

  const valid = await bcrypt.compare(oldPassword, data[0].password);
  if (!valid) return { success: false, message: '原密码错误' };

  const hashed = await bcrypt.hash(newPassword, 6);
  const { error: upErr } = await rdb.from('users').update({ password: hashed }).eq('id', id);
  if (upErr) return { success: false, message: '更新失败: ' + upErr.message };

  return { success: true, message: '密码修改成功' };
}

// 删除用户
async function deleteUser(event) {
  const { id } = event;
  if (!id) return { success: false, message: '用户ID不能为空' };

  const { error } = await rdb.from('users').delete().eq('id', id);
  if (error) return { success: false, message: '删除失败: ' + error.message };

  return { success: true, message: '用户删除成功' };
}
