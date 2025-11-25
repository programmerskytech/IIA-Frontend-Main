import React from 'react'

const Tab = ({icon, title, onClick, key}) => {
  return (
    <div 
          key={key} 
          onClick={onClick}
          className={`cursor-pointer bg-darkBlue text-offWhite px-4 py-4 rounded-t-3xl rounded-l-3xl`}
        >
          <span className='duty-tab-icon'>{icon}</span> <br /> <br />
          <div>{title}</div>
        </div>
  )
}

export default Tab
