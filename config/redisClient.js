const { createClient } = require('redis');

const client = createClient({
  username: 'default',
  password: 'hg2z8hTbdYf9Ec9otjcX2q5pxtc4w6pA',
  socket: {
    host: 'redis-18406.crce176.me-central-1-1.ec2.redns.redis-cloud.com',
    port: 18406
  }
});

client.on('error', err => console.log('Redis Client Error', err));

// جعل هذه الدالة async
(async () => {
  try {
    await client.connect();  // الاتصال بـ Redis

    await client.set('foo', 'bar');  // وضع قيمة في Redis
    const result = await client.get('foo');  // قراءة القيمة
    console.log(result);  // يجب أن تطبع "bar"

    await client.quit();  // إغلاق الاتصال بـ Redis بعد الانتهاء
  } catch (err) {
    console.error('Redis Error:', err);
  }
})();
