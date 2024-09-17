const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

// API to fetch all seats
app.get('/seats', async (req, res) => {
  try {
    const seats = await prisma.seat.findMany();
    res.json(seats);
  } catch (error) {
    res.status(402).json({
      error : error
    })
  }

});

// API to book seats
app.post('/seats/book', async (req, res) => {  
  const { seatNumbers } = req.body;

  try {
    const updatedSeats = await prisma.seat.updateMany({
      where: { seatNumber: { in: seatNumbers }, status: 'available' },
      data: { status: 'booked' },
    });

    if (updatedSeats.count === 0) {
      return res.status(400).json({ message: 'Seats not available!' });
    }

    res.json({ message: 'Seats booked successfully!', bookedSeats: seatNumbers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to book seats', error : error });
  }
});

// Route to reset all booked seats
app.put('/seats/reset', async (req, res) => {
  try {
    // Update all seats where the status is 'booked'
    const result = await prisma.seat.updateMany({
      where: { status: 'booked' },
      data: { status: 'available' },
    });

    res.status(200).json({ message: 'All booked seats have been reset to available.', result });
  } catch (error) {
    console.error('Error resetting seats:', error);
    res.status(500).json({ message: 'Failed to reset seats.', error });
  }
});


// Route to delete all seats
app.delete('/seats', async (req, res) => {
  try {
    // Delete all records from the 'seat' table
    await prisma.seat.deleteMany();

    res.status(200).json({ message: 'All seats have been deleted' });
  } catch (error) {
    console.error('Error deleting seats:', error);
    res.status(500).json({ error: 'Failed to delete all seats' });
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
