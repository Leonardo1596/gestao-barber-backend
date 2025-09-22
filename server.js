require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cron = require('node-cron');
const port = process.env.PORT || 8000;

const Barbershop = require('./models/BarbershopSchema');
const { generateReportJob } = require('./controllers/HistoryReportController');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

// Import routes
const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');
const barberRoutes = require('./routes/barbers');
const appointmentRoutes = require('./routes/appointments');
const transactionRoutes = require('./routes/transaction');
const productRoutes = require('./routes/product');
const reportRoutes = require('./routes/report');
const historyReportRoutes = require('./routes/historyReport');

app.use(userRoutes);
app.use(serviceRoutes);
app.use(barberRoutes);
app.use(appointmentRoutes);
app.use(transactionRoutes);
app.use(productRoutes);
app.use(reportRoutes);
app.use(historyReportRoutes);

app.get('/', (req, res) => {
  res.send('🚀 API está ativa!');
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        app.emit('ready');
        console.log('Connected to MongoDB');
    })
    .catch((error) => console.log(error));

// Server
app.on('ready', () => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
        console.log(`http://localhost:${8000}`);

        cron.schedule('59 23 * * 0', async () => {
            console.log('Gerando relatório semanal...');
            const now = new Date();

            const endDate = new Date(now);
            endDate.setDate(now.getDate() - 1);
            endDate.setHours(23, 59, 59, 999);

            const startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - 5);
            startDate.setHours(0, 0, 0, 0);

            try {
                const barbershops = await Barbershop.find();

                for (const shop of barbershops) {
                    await generateReportJob({
                        type: 'weekly',
                        barbershop: shop._id,
                        startDate,
                        endDate
                    });
                    console.log(`Relatório semanal gerado para barbearia ${shop.name} (${shop._id})`);
                }

                console.log('Relatórios semanais gerados com sucesso para todas as barbearias!');
            } catch (err) {
                console.error('Erro ao gerar relatório semanal:', err);
            }
        });

    cron.schedule('59 23 28-31 * *', async () => {
        const now = new Date();
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        if (now.getDate() !== lastDay.getDate()) return;

        console.log('Gerando relatório mensal...');
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        try {
            const barbershops = await Barbershop.find();

            for (const shop of barbershops) {
                await generateReportJob({
                    type: 'monthly',
                    barbershop: shop._id,
                    startDate,
                    endDate
                });
                console.log(`Relatório mensal gerado para barbearia ${shop.name} (${shop._id})`);
            }

            console.log('Relatórios mensais gerados com sucesso para todas as barbearias!');
        } catch (err) {
            console.error('Erro ao gerar relatório mensal:', err);
        }
    });
})
});