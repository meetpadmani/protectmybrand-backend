require('dotenv').config();
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Exists' : 'Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Exists' : 'Missing');
