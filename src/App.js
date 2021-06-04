import React, { useState,useEffect } from 'react';
import { CalendarComponent } from '@syncfusion/ej2-react-calendars';
import './App.css';
import Loading from './Loading';


export default function App() {
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState({hight:false})
  const [details,setDetails] = useState([])

  const fetchData = async () => {
    setLoading(true)
    //train 1, metro 2, lightRail 4,bus 5,ferry 9
    try {
      let queryUrl = ''
      console.log(params)
      if(params.metro){
        queryUrl+="&filterMOTType=2"
      }
      if(params.train){
        queryUrl+="&filterMOTType=1"
      }
      if(params.lightRail){
        queryUrl+="&filterMOTType=4"
      }
      if(params.bus){
        queryUrl+="&filterMOTType=5"
      }
      if(params.ferry){
        queryUrl+="&filterMOTType=9"
      }
      if(params.filterDateValid){
        queryUrl+="&filterDateValid=" + params.filterDateValid
      }

      console.log("/v1/tp/add_info?outputFormat=rapidJSON&filterPublicationStatus=current" + queryUrl)

      const response = await fetch("/v1/tp/add_info?outputFormat=rapidJSON&filterPublicationStatus=current" + queryUrl, {
        //method: 'GET',
        headers: {
          'Authorization': 'apikey rW87skJDoE4rEqwfB0HvIMeYTO2RdbfBYv6w',
          'Content-Type':'application/json',
        },
    })
      const data = await response.text().then((res)=>JSON.parse(res))
      const newInfo = data.infos.current.filter(
        (obj)=>(params.hight?obj.priority==='hight':false)
              ||(params.normal?obj.priority==='normal':false)
              ||(params.low?obj.priority==='low':false));

      setDetails(newInfo)
      setLoading(false)
    } catch (error) {
       setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [params])

const handleCal  = (e) => {
  const newDate = e.target.value
  let mm = newDate.getMonth()+1;
  let dd = newDate.getDate();

   let str = [(dd>9 ? '' : '0') + dd,
   (mm>9 ? '' : '0') + mm,
   newDate.getFullYear()
  ].join('-');

   setParams(prevParams=>{
    return {...prevParams,['filterDateValid']:str}
  })
}

  function handleParamChange(e){
    const param = e.target.name
    const value = e.target.checked

    setParams(prevParams=>{
      return {...prevParams,[param]:value}
    })
  }


  return (
    <>
      <div className='block-left'>  
        <h5>Filters:</h5>
        <h5>Priority</h5>
        <input type='checkbox' name = 'hight' onChange={handleParamChange} checked={params.hight} />&nbsp;High
        <br/>
        <input type='checkbox' name = 'normal' onChange={handleParamChange} checked={params.normal} />&nbsp;Normal
        <br/>
        <input type='checkbox' name = 'low' onChange={handleParamChange} checked={params.low} />&nbsp;Low
        <br/>
        <br/>
        <h5>Mode</h5>
        <input type='checkbox' name = 'metro' onChange={handleParamChange} checked={params.metro} />&nbsp;Metro
        <br/>
        <input type='checkbox' name = 'train' onChange={handleParamChange} checked={params.train} />&nbsp;Train
        <br/>
        <input type='checkbox' name = 'bus' onChange={handleParamChange} checked={params.bus} />&nbsp;Bus
        <br/>
        <input type='checkbox' name = 'ferry' onChange={handleParamChange} checked={params.ferry} />&nbsp;Ferry
        <br/>
        <input type='checkbox' name = 'lightRail' onChange={handleParamChange} checked={params.lightRail} />&nbsp;Light Rail


      </div>
      <div className='block-midle'>
        <CalendarComponent  onChange={handleCal}/>
      </div>
      <div className='block-right'>
        <Loading loading = {loading}/>
      {
        details.map((detail)=>{

          return (
            <div key={detail.id}>
              <div dangerouslySetInnerHTML={{__html: detail.subtitle}} />
              <div dangerouslySetInnerHTML={{__html: detail.content}} />
              <br/>
            </div>
          )
        })
      }

      </div>
    </>
  )
}



