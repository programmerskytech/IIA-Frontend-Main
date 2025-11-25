import React from 'react'
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import IconBtn from './DKG_IconBtn';

const SubHeader = ({title, link}) => {
    const navigate = useNavigate()
  return (
    <header className='shadow-sm py-2'>
      <IconBtn icon={ArrowLeftOutlined} onClick={()=>navigate(link)} className='mr-4 shadow-none bg-inherit'/>
      <span className='font-medium !text-xl'>{title}</span>
    </header>
  )
}

export default SubHeader
