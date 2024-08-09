const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Add cors
const Note = require('./models/Note'); // Note model (explained later)
const Group = require('./models/Group'); // Group model (explained later)

dotenv.config();

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes

app.get('/groups', async (req, res) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/groups', async (req, res) => {
  try {
    const { groupName, groupColor } = req.body;
    const newGroup = new Group({ groupName, groupColor });
    await newGroup.save();
    res.status(201).json({ message: 'Group created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/notes/:groupId', async (req, res) => {
  try {
    const notes = await Note.find({ groupId: req.params.groupId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/notes/:groupId', async (req, res) => {
  try {
    const { text } = req.body;
    const groupId = req.params.groupId;
    const newNote = new Note({ text, groupId });
    await newNote.save();
    res.status(201).json({ message: 'Note created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/',(req,res)=>{
  res.status(200).send("hello from server");
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));