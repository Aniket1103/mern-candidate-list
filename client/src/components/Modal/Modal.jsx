import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, setFormData, handleApply }) => {
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value)
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-title">Apply for this job</div>
        
        <form className="modal-form">
          <label>
            Enter your skills
            <input type="text" onChange={handleInputChange} name='skills' placeholder="Enter your skills" />
          </label>
          <label>
            Select your college/university
            <select name="college" onChange={handleInputChange} required>
              <option>{null}</option>
              <option>Mumbai University</option>
              <option>V.C.E.T.</option>
              <option>Other</option>
              {/* Add your options here */}
            </select>
          </label>
          <div className="modal-form-row">
            <label>
              Enter your name
              <input type="text" onChange={handleInputChange} name='name' placeholder="Eg. John Doe" required />
            </label>
            <label>
            Select your Batch
            <input type="text" onChange={handleInputChange} name='batch' placeholder="Eg. 2020-24" />
            </label>
          </div>
          <label>
              Email Id:
              <input type="text" onChange={handleInputChange} name='email' placeholder="Eg. example@gmail.com" />
          </label>
          <div className="modal-form-row">
            <label>
              Enter your role
              <input type="text" onChange={handleInputChange} name='role' placeholder="Eg. Frontend Developer" />
            </label>
            <label>
              Enter company you are working for
              <input type="text" onChange={handleInputChange} name='experience' placeholder="Eg. engineerHUB" />
            </label>
          </div>
          <label>
            {/* Upload your Resume */}
            {/* <input type="file" /> */}
            Enter resume drive link <code>(Eg. https://shorturl.at/5N4gE)</code>
              <input type="text" onChange={handleInputChange} name='resume' placeholder="Eg. resume-link.com" />
          </label>
          <div style={{width: '105%', borderTop: '1.5px solid #ddd', marginLeft: '-1rem', display:'flex', justifyContent:'flex-end'}}>
            <button type="submit" className="modal-submit" onClick={handleApply}>Apply</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
