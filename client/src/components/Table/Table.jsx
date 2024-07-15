import React, { useState, useEffect } from 'react';
import './Table.css';
import axios from 'axios';
import Candidate from '../Candidate/Candidate';
import { FiUserPlus, FiUserX } from "react-icons/fi";
import { BiArchiveIn } from "react-icons/bi";
import { MdDeleteOutline, MdOutlineEmail, MdOutlineFileDownload } from "react-icons/md";
import { saveAs } from 'file-saver';
import { FaRegPaperPlane, FaAngleLeft, FaAngleRight } from "react-icons/fa";

const TABS = {
  uncategorized: "uncategorized",
  shortlisted: "shortlisted",
  rejected: "rejected",
  processing: "processing",
  showall: "showall",
}

const Table = ({ candidates, setCandidates, openModal }) => {

  const [tab, setTab] = useState(TABS.uncategorized);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const [responseAccept, setResponseAccept] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [categorizedCandidates, setCategorizedCandidates] = useState([]);

  const handleTabSwitch = (newTab) => {
    setTab(newTab);
    setPageNo(1);
    setSelectedList([]);
    // setSelectAll(false);
  };

  const downloadCsv = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASEURL}api/v1/downloadCsv`, categorizedCandidates, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      saveAs(blob, 'candidates.csv');
    } catch (error) {
      console.error('Error downloading the CSV file', error);
      alert(error);
    }
  };

  const handleSelectAll = (value) => {
    //last
    // if(!value) setSelectedList([]);
    // else setSelectAll(value);

    if (value) setSelectedList(categorizedCandidates.map(cand => cand._id));
    else setSelectedList([]);
  }

  const handleSelectedList = (reset, id, action) => {
    console.log(reset, id, action)
    if (reset) setSelectedList([]);
    if (action === 'add') setSelectedList(prev => [id, ...prev]);
    else if (action === 'remove') setSelectedList(prev => prev.filter((candId) => candId !== id));

  }

  const handleUpdate = async (id, updatedStatus) => {
    setSelectAll(false);
    updatedStatus = toTitleCase(updatedStatus);
    console.log(id, updatedStatus);
    let jsonString;
    if (!id) {
      if (selectedList.length === 0) return alert("No candidates selected");
      else jsonString = JSON.stringify(selectedList.map((id) => { return { id, "status": updatedStatus } }));
    }
    else jsonString = JSON.stringify([
      {
        "id": id,
        "status": updatedStatus
      }
    ]);

    let config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_BASEURL}api/v1/update`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: jsonString
    };

    const { data } = await axios.request(config);
    const updatedCand = data.results;

    // const updatedStatusCand = candidates.filter((cand) => cand._id === id)[0];
    let otherCandidates;
    if (!id) otherCandidates = candidates.filter((cand) => !selectedList.includes(cand._id));
    else otherCandidates = candidates.filter((cand) => cand._id !== id);
    // updatedStatusCand.status = updatedStatus;
    setSelectedList([]);

    console.log("updated Cand: ", updatedCand);
    setCandidates([...updatedCand, ...otherCandidates]);

  }

  const handleSendMail = async () => {
    try {
      
      let jsonString = JSON.stringify({
        ids: categorizedCandidates.reduce((emailList, cand) => {
          if(selectedList.includes(cand._id)) return [...emailList, cand.email];
          else return emailList;
        }, [])
      });

      console.log(jsonString)

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${import.meta.env.VITE_BASEURL}api/v1/sendMail`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: jsonString
      };

      const { data } = axios.post(config.url, {ids: categorizedCandidates.reduce((emailList, cand) => {
        if(selectedList.includes(cand._id)) return [...emailList, cand.email];
        else return emailList;
      }, [])});
      console.log(data)
      handleUpdate(null, TABS.processing);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = async (ids) => {
    console.log(ids);
    let jsonString = JSON.stringify({
      ids: ids
    });

    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_BASEURL}api/v1/delete`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: jsonString
    };

    const { data } = await axios.request(config);
    console.log(data)
    // const updatedCand = data.results[0];

    // const updatedStatusCand = candidates.filter((cand) => cand._id === id)[0];

    const otherCandidates = candidates.filter((cand) => !ids.includes(cand._id));
    setSelectedList([]);

    console.log("updated Cand: ", otherCandidates);
    setCandidates([...otherCandidates]);
  }

  const filterCandidates = (searchQuery) => {
    if (tab === TABS.showall) {
      if (searchQuery) setCategorizedCandidates(candidates.filter(cand => (cand.name.toLowerCase().includes(searchQuery) || cand.experience.toLowerCase().includes(searchQuery))));
      else setCategorizedCandidates(candidates);
    } else {
      if (searchQuery) setCategorizedCandidates(candidates.filter(cand => (cand?.status.toLowerCase() === tab) && (cand.name.toLowerCase().includes(searchQuery) || cand.experience.toLowerCase().includes(searchQuery))));
      else setCategorizedCandidates(candidates.filter(cand => cand?.status.toLowerCase() === tab));
    }
  }

  const handleSearch = (query) => {
    filterCandidates(query);
  }

  useEffect(() => {
    console.log(tab);
    setSelectAll(false);
    filterCandidates()
  }, [tab, candidates]);

  useEffect(() => {
    console.log("selectedList ", selectedList)
    // console.log(selectedList.length, categorizedCandidates.length);
    if ((categorizedCandidates.length > 0) && (selectedList.length === categorizedCandidates.length)) {
      console.log("All selected");
      setSelectAll(true);
    }

    // else setSelectAll(false);
    // return () => {
    //   setSelectAll(false);
    // }
  }, [selectedList])


  return (
    <div className="table-container">
      <div className={`response-accept-status ${responseAccept ? 'accepting' : 'not-accepting'}`}>
        {
          responseAccept ?
            'This job is still accepting response' :
            'This job is not accepting response'
        }
      </div>
      <div className="table-header">
        <div className="accept-response" style={{ display: 'flex', alignItems: 'center', fontSize: '.7rem', gap: '2px', fontWeight: '500' }}>
          <input type="checkbox" name="accept-response" checked={!responseAccept} onChange={(e) => setResponseAccept(!e.target.checked)} />
          Do not accept response on this job
        </div>
        <div className="job-details" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ margin: '0.4rem 0rem' }}>
            Product Designer | ID : 1234567 | Part-time | Delhi
          </h2>
          {
            responseAccept ?
              (<button className='btn' onClick={openModal} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '.3rem' }}>
                <FaRegPaperPlane size={15} />
                <strong>  Apply </strong> </button>) :
              ''
          }
        </div>
        <div style={{ color: '#547178' }}>
          Posted on: 06/07/24/Sunday/06:00 PM
        </div>
      </div>
      <br />
      <div className="head-menu">
        <div className='tabs-bar'>
          <button className={`btn tab ${(tab === TABS.uncategorized) ? 'active-tab' : ''}`} onClick={() => handleTabSwitch(TABS.uncategorized)} >Uncategorized <div className='cat-count'> {candidates.filter(cand => cand.status.toLowerCase() === TABS.uncategorized).length} </div> </button>
          <button className={`btn tab ${(tab === TABS.shortlisted) ? 'active-tab' : ''}`} onClick={() => handleTabSwitch(TABS.shortlisted)} >Shortlisted <div className='cat-count'> {candidates.filter(cand => cand.status.toLowerCase() === TABS.shortlisted).length} </div> </button>
          <button className={`btn tab ${(tab === TABS.rejected) ? 'active-tab' : ''}`} onClick={() => handleTabSwitch(TABS.rejected)} >Rejected <div className='cat-count'> {candidates.filter(cand => cand.status.toLowerCase() === TABS.rejected).length} </div> </button>
          <button className={`btn tab ${(tab === TABS.processing) ? 'active-tab' : ''}`} onClick={() => handleTabSwitch(TABS.processing)} >Processing <div className='cat-count'> {candidates.filter(cand => cand.status.toLowerCase() === TABS.processing).length} </div> </button>
          <button className={`btn tab show-all ${(tab === TABS.showall) ? 'active-tab' : ''}`} onClick={() => handleTabSwitch(TABS.showall)} >Show All <div className='cat-count'> {candidates.length} </div> </button>
        </div>

        <div className='header-actions' style={{ display: "flex" }}>
          <button className={`btn send-mail ${!(tab === TABS.shortlisted || tab === TABS.processing) ? 'hidden' : ''}`} onClick={handleSendMail}>
            <MdOutlineEmail size={17} />
            <span>Send Mail</span>
          </button>
          <button className="btn download" onClick={downloadCsv} >
            <MdOutlineFileDownload size={19} /> <span>Download</span>
          </button>
        </div>
      </div>
      <hr></hr>
      <div className="table-menu">
        <div className="batch-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }} >
            <input className='checkbox' type="checkbox" onChange={(e) => handleSelectAll(e.target.checked)} checked={(categorizedCandidates.length > 0) && (selectedList.length === categorizedCandidates.length)} />
            <div style={{ width: '5.9rem', margin: 0, padding: '0 1px', fontWeight: '600', justifyContent: 'center' }}>Select All {`(${selectedList.length}/${categorizedCandidates.length})`}</div>
          </div>
          {
            tab === TABS.processing ||
            (<>
              {
                tab === TABS.shortlisted ||
                <button onClick={() => handleUpdate(null, TABS.shortlisted)}><FiUserPlus size={16} /></button>
              }
              {
                tab === TABS.rejected ||
                <button onClick={() => handleUpdate(null, TABS.rejected)}><FiUserX size={16} /></button>
              }
              {
                tab === TABS.uncategorized ||
                <button onClick={() => handleUpdate(null, TABS.uncategorized)}><BiArchiveIn size={16} /></button>
              }
              <button onClick={() => handleDelete(selectedList)}><MdDeleteOutline size={16} /></button>
            </>)
          }
        </div>
        <input type="text" className="search" placeholder="Search by name, experience..." onChange={(e) => handleSearch(e.target.value)} />
      </div>
      <br></br>
      <table className="candidate-table">
        <thead>
          <tr>
            <th style={{ width: '0rem' }}></th>
            <th style={{ minWidth: '5rem' }}>Name</th>
            <th>Skills</th>
            <th>College/University</th>
            <th>Batch</th>
            <th>Experience</th>
            <th>Resume</th>
            <th style={{ minWidth: '6rem' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categorizedCandidates.slice((pageNo-1)*6, pageNo*6).map((candidate, index) => (
            <Candidate key={index} candidate={candidate} index={index} tab={tab} TABS={TABS} selectAll={selectAll} value={selectedList.includes(candidate._id)} setSelectAll={setSelectAll} handleUpdate={handleUpdate} handleDelete={handleDelete} handleSelectedList={handleSelectedList} setSelectedList={setSelectedList} toTitleCase={toTitleCase}/>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button className="page" onClick={() => setPageNo(prev => prev - 1)} disabled={pageNo===1} > <FaAngleLeft /> </button>
        <button className="page"> {pageNo} </button>
        <button className="page" onClick={() => setPageNo(prev => prev + 1)} disabled={pageNo===Math.ceil(categorizedCandidates.length / 6)}> <FaAngleRight /> </button>
      </div>
    </div>
  );
};

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

export default Table;
