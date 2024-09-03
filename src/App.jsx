import { useState, useMemo } from 'react'
import './App.css'
import {
  client,
  useConfig,
  useElementColumns,
  useElementData,
 } from "@sigmacomputing/plugin";
 
 
 client.config.configureEditorPanel([
  { name: "source", type: "element" },
  {
    name: "HTML",
    type: "column",
    source: "source",
    allowMultiple: true,
    allowedTypes: ['datetime', 'integer', 'text', 'boolean', 'number']
  },
 ]);
 
 
 const App = () => {
 
 
  const config = useConfig();
  const sigmaCols = useElementColumns(config.source);
  const sigmaData = useElementData(config.source);
  const [count, setCount] = useState(0)

  // mapping function for returning the data in the expected format below. Needs some work to flexibly handle data type conversions
  const data = useMemo(() => {
    const result = [];
    if (Object.keys(sigmaData).length) {
      const entries = Object.entries(sigmaData);
      for (let i = 0; i < entries[0][1].length; i++) {
        const row = {};
        for (const [columnId, values] of entries) {
          if (sigmaCols[columnId] && sigmaCols[columnId].name) {
            const columnName = sigmaCols[columnId].name.toLowerCase();
            let value = values[i];
            if (columnName === 'date') {
              value = new Date(values[i]);
            }
            row[columnName] = value;
          }
        }
        result.push(row);
      }
    }
    result.sort((a,b) => (a.date > b.date) ? 1 : -1)
    return result;
  }, [sigmaCols, sigmaData])
  
  // handling for async loading call below
  if(!data || !data.length) {
    return (<div>Loading...</div>)
  }

  // console.log('HTML: ',sigmaData[config.HTML][0]);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: sigmaData[config.HTML][0]}} />
    </>
  )
}

export default App
