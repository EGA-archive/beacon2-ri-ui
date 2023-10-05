import './Verifier.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import configData from "../../config.json";

function Verifier () {
  const [verifierUrl, setVerifierUrl] = useState('')
  const [response, setResponse] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [errorsFound, setErrorsFound] = useState('')
  const [timeOut, setTimeout] = useState(true)
  const [error, setErrror] = useState('')
  const [stringDataToCopy, setStringDataToCopy] = useState('')

  const handleChangeVerifierUrl = e => {
    setVerifierUrl(e.target.value)
  }

  const copyData = e => {
    //var ctype = document.getElementById('copydata').innerHTML
    //console.log(ctype)
    navigator.clipboard.writeText(stringDataToCopy)
    console.log('COPY DONE')
  }

  const submitVerifierUrl = async e => {
    setTimeout(false)
    e.preventDefault()
    try {
      let res = await axios.get(
        `https://beacons.bsc.es/beacon-network/v2.0.0/validate?endpoint=${verifierUrl}`
      )
      console.log(res)
      let stringData = ''
      res.data.forEach(element => {
        element = JSON.stringify(element, null, 2)
        stringData = stringData + element + '\n'
        stringData = stringData.replace('{', '')
        stringData = stringData.replace('}', '')
        stringData = stringData.replace(/[ '"]+/g, ' ')
      })

      setStringDataToCopy(stringData)

      let isProperty = res.data.some(object => 'code' in object)
      console.log(isProperty)

      if (isProperty === false) {
        setErrorsFound(true)
      } else {
        setErrorsFound(false)
      }

      setResponse(res.data)

      if (res !== null && res !== undefined) {
        setShowResults(true)
        setTimeout(true)
      }
    } catch (error) {
      console.log(error)
      setErrror('Please retry. The validation could not be performed.')
    }
  }

  return (
    <div className='verifierContainer'>
      <h8>Please insert the URL of your Beacon</h8>
      <div>
        <input
          className='inputVerifierUrl'
          type='text'
          value={verifierUrl}
          onChange={handleChangeVerifierUrl}
          placeholder={'https://beacons.bsc.es/beacon/v2.0.0'}
        ></input>
        <button className='submitButton' onClick={submitVerifierUrl}>
          SUBMIT
        </button>
      </div>
      <div className='resultsContainerVerifier'>
        {timeOut === false && (
          <div className='loader2'>
            <div id='ld3'>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}

        {showResults === true && timeOut === true && (
          <div className='copyDiv'>
            <button onClick={copyData}>
              {' '}
              <img className='copyLogo' src='../copy.png' alt='copyIcon'></img>
            </button>
          </div>
        )}

        {showResults === true &&
          timeOut === true &&
          response.map((element, index) => {
            return (
              <div className='messageContainer'>
                <div id='copydata'>
                  {element.code === undefined && <h1>{element.message}</h1>}

                  {element.code && (
                    <div className='errorContainer'>
                      <h10>ERROR!</h10>
                      <div className='errorMessage'>
                        <h9>Code:</h9>
                        <h1>{element.code}</h1>
                        <h9>Location:</h9>
                        <h1>{element.location}</h1>
                        <h9>Message:</h9>
                        <h1>{element.message}</h1>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

        {errorsFound === true && (
          <h11>
            Congratulations! Validation has finished. No errors detected.
          </h11>
        )}
      </div>
    </div>
  )
}

export default Verifier
