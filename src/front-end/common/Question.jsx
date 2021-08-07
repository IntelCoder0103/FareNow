import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { getServiceQuestion } from "../../store/Slices/services/ServiceSclice";
export const Question = (props) => {
    const { serviceId, subServiceId} = props;
    const [state, setState] = useState({ question : [], currentStep : 0, error : '' });
    const [select, setSelect] = useState({});
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getServiceQuestion(subServiceId));
    }, []);

    const questionArray = useSelector((state) => state.service);
    useEffect(() => {
        if (questionArray && questionArray !== undefined && questionArray !== null){
            setState(state => ({
                ...state,
                question: questionArray
            }));
        }
    }, [questionArray, state.question]);
    const handleRadioChange = (e) => {
        setSelect(select => ({
            ...select,
            [e.target.name]: e.target.value,
        }));

        setState(state=>({...state, error: ''}));
    }

    const handleBackClick = () => {
        if (state.question && state.question.data && state.currentStep > 0){
            setState(state => ({
                ...state,
                currentStep: state.currentStep - 1
            }));
        }
    }

    const handleNextClick = (e) => {
        if (state.question && state.question.data && state.currentStep < (state.question.data.questions.length-1)) {
            if (select[`question_no_${state.question.data.questions[state.currentStep].id}`]){
                setState(state => ({
                    ...state,
                    currentStep: state.currentStep + 1,
                    error : ''
                }));
            }else{
                setState(state => ({ ...state, error: <center className='col-md-12 text-danger'> please seclect a option!</center>}));
            }
        } else if (state.question && state.question.data && state.currentStep === (state.question.data.questions.length - 1)){
            e.preventDefault();

            var queryString = Object.keys(select).map(key => key[12] + '=' + `${select[key]}`).join('&');
            props.history.push({
                pathname: '/service-providers',
                search: `?service=${serviceId}&subService=${subServiceId}&${queryString}`,
                state: select
            });
        } else {
            console.log(state, select);
        }
    }

    return (
        <div className='row'>
            <div className="col-md-12">
                <div className="title-move mb-5">
                    {state.question ? state.question.data ? state.question.data.name : 'Please wait - - -' : ''}
                </div>
                <div className="question">
                    {state.question ? state.question.data && state.question.data.questions ? `${state.question.data.questions[state.currentStep].question}?` : 'Please wait - - -' : ''}
                </div>
                <div className='row'>
                    {state.error}
                {
                state.question ? state.question.data ? state.question.data.questions[state.currentStep].options.map((data, index)=>{
                    return(
                        <div key={index} className='col-md-12 mt-3 ml-5'>
                            <div className="form-check">
                                    <input 
                                        className="form-check-input radio" 
                                    checked={parseInt(select["question_no_" + state.question.data.questions[state.currentStep].id]) === data.id}
                                        defaultValue={data.id}
                                        type="radio" 
                                    name={`question_no_${state.question.data.questions[state.currentStep].id}`}
                                        id={`radio${index}`} 
                                        onChange={handleRadioChange}
                                    />
                                <label 
                                    className="form-check-label ml-4 option" 
                                    htmlFor={`radio${index}`}
                                >
                                    {data.option}
                                </label>
                            </div>
                        </div>
                    ) 
                
                    })
                    : '' 
                    : ''
                }
                </div>
                <div className="text-center mt-0">
                    {state.currentStep === 0 ? (
                        <button disabled onClick={handleBackClick} className="button-common-2 float-left mt-5 w-25">Back</button>
                    ) : (
                            <button onClick={handleBackClick} className="button-common-2 float-left mt-5 w-25">Back</button>
                    )}

                    {state.question.data && state.question.data.questions && (state.currentStep === (state.question.data.questions.length - 1)) ? (
                        <Link to="#" onClick={handleNextClick} className="button-common float-right mt-5 w-25">Search</Link>
                    ) : (
                        <button onClick={handleNextClick} className="button-common float-right mt-5 w-25">Next</button>
                    )}
                </div>
            </div>
        </div>
    )
}