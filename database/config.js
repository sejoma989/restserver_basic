import mongoose from 'mongoose';

const dbConnection = async() => {
    try {

        await mongoose.connect(process.env.MONGODB_ATLAS_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false
        });

        console.log('Base de datos online')
        
    } catch (error) {
        console.log(error);
        throw new Error('Error para iniciar conexion a base de datos');
    }

}

export {
    dbConnection
}