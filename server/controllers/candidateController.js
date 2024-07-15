import Candidate from '../models/candidate.js';
import nodemailer from 'nodemailer';
import process from 'process';
import { Parser } from 'json2csv';
import fs from 'fs';


export const getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find({}, null, {sort: {'_id': -1}});
        res.status(200).json({ results: candidates });
    } catch (error) {
        res.status(500).json({ message: 'Error while fetching data', error });
    }
};


export const updateBatch = async (req, res) => {
  const updates = req.body;
  console.log(updates);
  try {
    const updatePromises = updates.map(update => 
      Candidate.findByIdAndUpdate(update.id, { status: update.status }, { new: true })
    );
    const results = await Promise.all(updatePromises);
    res.status(200).json({ message: 'Batch update successful', results });
  } catch (error) {
    res.status(500).json({ message: 'Batch update failed', error });
  }
};

export const deleteBatch = async (req, res) => {
  const { ids } = req.body;
  console.log("Deleted: ", ids)
  try {
    await Candidate.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: 'Batch delete successful' });
  } catch (error) {
    res.status(500).json({ message: 'Batch delete failed', error });
  }
};

export const addCandidate = async (req, res) => {

  const { name, skills, college, email, batch, experience, resume } = req.body;

  const newCandidate = new Candidate({
    name,
    status: 'Uncategorized',
    email,
    skills,
    college,
    batch,
    experience,
    resume
  });

  try {
    const savedCandidate = await newCandidate.save();
    res.status(201).json({ message: 'Candidate added successfully', candidate: savedCandidate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to add candidate', error });
  }
};

export const sendMail = async (req, res) => {
  const {ids} = req.body;
  console.log("ids: ", ids);
  
  if(!ids || ids.length === 0) return res.status(400).json({message: "Need to add recievers email id/s."});
  try {
    const auth = nodemailer.createTransport({
      service: "gmail",
      secure : true,
      port : 465,
      auth: {
          user: process.env.emailid,
          pass: process.env.emailpassword

      }
  });

  const receiver = {
      from : process.env.emailid,
      to : ids.join(','),
      subject : "Application Status | engineerHub | NodeMailer",
      text : `
      Hi,
      Thank you for Applying.
      You are moved to the next round.
      Kindly acknowledge your acceptance.

      Thanks and Regards.
      engineerHub
      `
  };

  auth.sendMail(receiver, (error, emailResponse) => {
      if(error)
        return res.status(500).json({message: "Error while sending the mail", error});
      console.log("success!");
      return res.status(200).send({message: "Mail Sent", emailResponse});
  });
  } catch (error) {
    return res.status(500).json({message: "Error while sending the mail", error});
  }
}

export const downloadCsv = async (req, res) => {
  try {
    const candidates = req.body;

    if (!Array.isArray(candidates)) {
      return res.status(400).json({ message: 'Invalid data format. Expected an array of candidates.' });
    }
    const fields = ['name', 'status', 'skills', 'college', 'batch', 'experience', 'resume'];
    const opts = { fields };
    
    const parser = new Parser(opts);
    const csv = parser.parse(candidates);
    
    // const filePath = path.join(__dirname, 'candidates.csv');
    const filePath = process.cwd() + '/temp/candidates.csv';
    console.log(candidates)
    fs.writeFileSync(filePath, csv);

    res.download(filePath, 'candidates.csv', (err) => {
      if (err) {
        res.status(500).json({ message: 'Error while downloading CSV file', error: err });
      }

      fs.unlinkSync(filePath);
    });
  } catch (error) {
    res.status(500).json({ message: 'Error while generating CSV file', error });
  }
};

// export const downloadCsv = async (req, res)  => {
//   try {
//     // console.log(__dirname);
//     res.send(process.cwd())
//   } catch (error) {
//     res.status(500).json({message: "Error while dowloading the file"});
//   }
// }