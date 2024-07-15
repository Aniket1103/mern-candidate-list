import React, { useEffect, useState } from 'react'
import { FiUserPlus, FiUserX } from "react-icons/fi";
import { BiArchiveIn } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";

const Candidate = ({ candidate, index, tab, TABS, selectAll, value, handleUpdate, handleDelete, handleSelectedList, toTitleCase }) => {
  const [selected, setSelected] = useState(selectAll);

  const handleSelect = async (value) => {
    try {
      // setSelected(value);
      handleSelectedList(null, candidate._id, value ? 'add' : 'remove');
      // if(!value) setSelectAll(value);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log(selectAll, tab);
    // setSelected(selectAll);
    // if(selectAll === false) handleSelectedList(true);
  }, [selectAll, tab])


  // useEffect(() => {
  //   handleSelectedList(null, candidate._id, selected ? 'add' : 'remove');
  // }, [selected])


  return (
    <>
      <tr key={index} >
        <td><input className='checkbox' type="checkbox" checked={value} onChange={(e) => handleSelect(e.target.checked)} /></td>
        <td >
          <div>
          {candidate.name}
          </div>
          {
            (tab === TABS.showall) ? 
              <div className={`status-tag ${candidate.status.toLowerCase()}`}>
                {candidate?.status}
              </div> : <></>
          }
        </td>
        <td>{candidate.skills}</td>
        <td>{candidate.college}</td>
        <td>{candidate.batch}</td>
        <td>{candidate.experience}</td>
        <td><a href={candidate.resume} target='_blank'>Link to view</a></td>
        <td className="actions">
          {
            tab === TABS.processing ||
            <>
              {
                tab === TABS.shortlisted ||
                <button onClick={() => handleUpdate(candidate._id, TABS.shortlisted)}><FiUserPlus size={16}/></button>
              }
              {
                tab === TABS.rejected ||
                <button onClick={() => handleUpdate(candidate._id, TABS.rejected)}><FiUserX size={16}/></button>
              }
              {
                tab === TABS.uncategorized ||
                <button onClick={() => handleUpdate(candidate._id, TABS.uncategorized)}><BiArchiveIn size={16}/></button>
              }
              <button onClick={() => handleDelete([candidate._id])}><MdDeleteOutline size={16}/></button>
            </>
          }
          {tab !== TABS.processing ||
            <>
              <input type="checkbox" /> <span>Mark Hired</span>
            </>
          }
        </td>
      </tr>
    </>
  )
}

export default Candidate