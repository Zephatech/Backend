const nodemailer = require('nodemailer');
const uuid = require('uuid');


// 保存已注册但未验证的用户信息
const unverifiedUsers = {};

// 邮件发送配置
const transporter = nodemailer.createTransport({
  service: 'your-email-service-provider',
  auth: {
    user: 'your-email@example.com',
    pass: 'your-email-password',
  },
});

// 注册页面路由

// 处理注册请求


// 处理验证链接
app.get('/verify/:verificationToken', (req, res) => {
  const verificationToken = req.params.verificationToken;

  // 在未验证用户列表中查找并处理验证请求
  const user = Object.values(unverifiedUsers).find(
    (user) => user.verificationToken === verificationToken
  );

  if (!user) {
    return res.send('验证链接无效或已过期。');
  }

  // 将用户标记为已验证并保存到数据库
  // 这里只是一个示例，实际上应该将用户信息保存到数据库中
  console.log(`用户 ${user.username} 邮箱验证成功！`);
  delete unverifiedUsers[user.email]; // 从未验证用户列表中移除用户

  res.send('邮箱验证成功！您现在可以登录系统。');
});

// 启动服务器
app.listen(3000, () => {
  console.log('服务器已启动，监听端口 3000');
});
