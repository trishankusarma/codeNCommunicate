const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL , {
      useCreateIndex:true,
      useFindAndModify:false,
      useUnifiedTopology:true,
      useNewUrlParser:true
})

const db = mongoose.connection

db.once('open',()=>console.log('Connected to MongoDB'))

db.on('error',(error) => console.error(error))
