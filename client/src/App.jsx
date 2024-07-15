import { useEffect, useState } from 'react'
import TopBar from './components/TopBar/TopBar'
import Table from './components/Table/Table'
import axios from 'axios';
import Modal from './components/Modal/Modal';

// const candidates = [
//   {
//     name: 'Girish Shedge',
//     status: 'Shortlisted',
//     skills: 'Figma, Adobe Photoshop, Illustrator',
//     college: 'Bharati Vidyapeeth College of Engineering and Technology',
//     batch: '2024-28',
//     experience: 'Product Designer @engineerHUB',
//     resume: 'https://shorturl.at/5N4gE'
//   },
//   {
//     name: 'Girish Shedge',
//     status: 'Rejected',
//     skills: 'Figma, Adobe Photoshop, Illustrator',
//     college: 'Bharati Vidyapeeth College of Engineering and Technology',
//     batch: '2024-28',
//     experience: 'Product Designer @engineerHUB',
//     resume: 'https://shorturl.at/5N4gE'
//   },
//   {
//     name: 'Girish Shedge',
//     status: 'Processing',
//     skills: 'Figma, Adobe Photoshop, Illustrator',
//     college: 'Bharati Vidyapeeth College of Engineering and Technology',
//     batch: '2024-28',
//     experience: 'Product Designer @engineerHUB',
//     resume: 'https://shorturl.at/5N4gE'
//   },
//   {
//     name: 'Girish Shedge',
//     status: 'Uncategorized',
//     skills: 'Figma, Adobe Photoshop, Illustrator',
//     college: 'Bharati Vidyapeeth College of Engineering and Technology',
//     batch: '2024-28',
//     experience: 'Product Designer @engineerHUB',
//     resume: 'https://shorturl.at/5N4gE'
//   },
//   {
//     name: 'Girish Shedge',
//     status: 'Shortlisted',
//     skills: 'Figma, Adobe Photoshop, Illustrator',
//     college: 'Bharati Vidyapeeth College of Engineering and Technology',
//     batch: '2024-28',
//     experience: 'Product Designer @engineerHUB',
//     resume: 'https://shorturl.at/5N4gE'
//   },
//   {
//     name: 'Girish Shedge',
//     status: 'Rejected',
//     skills: 'Figma, Adobe Photoshop, Illustrator',
//     college: 'Bharati Vidyapeeth College of Engineering and Technology',
//     batch: '2024-28',
//     experience: 'Product Designer @engineerHUB',
//     resume: 'https://shorturl.at/5N4gE'
//   },
//   {
//     name: 'Girish Shedge',
//     status: 'Processing',
//     skills: 'Figma, Adobe Photoshop, Illustrator',
//     college: 'Bharati Vidyapeeth College of Engineering and Technology',
//     batch: '2024-28',
//     experience: 'Product Designer @engineerHUB',
//     resume: 'https://shorturl.at/5N4gE'
//   },
//   {
//     name: 'Girish Shedge',
//     status: 'Uncategorized',
//     skills: 'Figma, Adobe Photoshop, Illustrator',
//     college: 'Bharati Vidyapeeth College of Engineering and Technology',
//     batch: '2024-28',
//     experience: 'Product Designer @engineerHUB',
//     resume: 'https://shorturl.at/5N4gE'
//   },
// ];

function App() {
  const [candidates, setCandidates] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    "name": '',
    "status": 'Uncategorized',
    "email": '',
    "skills": '',
    "college": '',
    "batch": '',
    "experience": '',
    "resume": ''
  })

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const getCandidates = async () => {
    try {
      console.log(import.meta.env)
      const { data } = await axios.get(`${import.meta.env.VITE_BASEURL}api/v1/getCandidates`);
      console.log(data.results);
      setCandidates(data.results);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const handleApply = async () => {
    try{
      console.log("applied formdata", formData);
      const {data} = await axios.post(`${import.meta.env.VITE_BASEURL}api/v1/addCandidate`, formData);
      console.log("Apply details: ", data);
      alert(data);

    } catch(error) {
      console.log("error while Applying ", error);
      alert(error);
    }
  }

  useEffect(() => {
    getCandidates();
  }, []);

  useEffect(() => {
    console.log("FormData->>", formData);
  }, [formData])



  return (
    <>
      <TopBar/>
      <div className='main-content'>
        <br></br>
      <Modal isOpen={isModalOpen} onClose={closeModal} setFormData={setFormData} handleApply={handleApply} />
        {
          (candidates.length === 0) ||
          <Table candidates={candidates} setCandidates={setCandidates} openModal={openModal}/>
        }
      </div>
    </>
  )
}

export default App
