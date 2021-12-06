import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getVehicleTypes } from './../../store/Slices/moving/movingSlice'
import ServiceType from './../../constants/ServiceType'
import PlacesAutocomplete from 'react-places-autocomplete';
import moment from 'moment';
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from "axios";

export const Moving = (props) => {

    const [state, setState] = useState({
        vehicle_type_id: '',
        from_address: '',
        to_address: '',
        start_lat: '',
        start_lng: '',
        end_lat: '',
        end_lng: '',
        date: new Date(),
        zip_code: '',
        service_type: ServiceType.MOVING,
    });

    const dispatch = useDispatch();

    const loading = useSelector((state) => state.movingReducer?.list?.loading);
    const data = useSelector((state) => state.movingReducer?.list?.data);
    const error = useSelector((state) => state.movingReducer?.list?.error);
    const message = useSelector((state) => state.movingReducer?.list?.message);

    useEffect(() => {
      dispatch(getVehicleTypes());
    }, []);

    const handleSelectTypeClick = (vehicle_type_id) => {
        vehicle_type_id === state.vehicle_type_id ? vehicle_type_id='' : vehicle_type_id=vehicle_type_id;
        setState((state) => ({
            ...state, vehicle_type_id
        }))
    }

    const handleChangeZipCode = (e) => {
        const { name, value } = e.target;
        let re = /^(0|[1-9][0-9]*)$/;

        setState((state) => ({
          ...state,
          [name]: value,
          selectedZipCode: false,
        }));
        if (value.length < 3 || value.length > 12 || !re.test(value)) {
          setState((state) => ({
            ...state,
            zipCodeErr: (
              <div
                className="col-md-12 text-danger mt-2"
                style={{ fontSize: 15 }}
              >
                Zip Code characher(Number only) should be in between 4 and 12
              </div>
            ),
          }));
        } else {
          setState((state) => ({ ...state, zipCodeErr: "" }));
          axios({
            method: "get",
            url:
              process.env.REACT_APP_API_BASE_URL +
              "/api/user/services/zip-code?zipCode=" +
              value,
          })
            .then(function (response) {
              setState((state) => ({
                ...state,
                zipCodeData: response?.data?.data?.data,
                zipCodeDataErr: "",
              }));
            })
            .catch((error) => {
              setState((state) => ({
                ...state,
                zipCodeData: "",
                zipCodeDataErr: error?.response?.data,
              }));
            });
        }
    }

    const handleFromAdessSelect = (from_address) => {
        setState((state) => ({
            ...state, from_address
        }));

        geocodeByAddress(from_address).then(results => getLatLng(results[0])).then(({ lat, lng }) => {
            setState((state) => ({
                ...state, start_lat: `${lat}`, start_lng: `${lng}`
            }));
        });
    }

    const handleToAdessSelect = (to_address) => {
        setState((state) => ({
            ...state, to_address
        }));

        geocodeByAddress(to_address).then(results => getLatLng(results[0])).then(({ lat, lng }) => {
            setState((state) => ({
                ...state, end_lat: `${lat}`, end_lng: `${lng}`
            }));
        });
    }

    const handleCalendarClick = (selectedDate) => {
        let date = new Date();
        if(new Date(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`) <= new Date(`${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`)){
            setState((state) => ({
                ...state, date: selectedDate
            }));
        }
    }

     const handleSelectZipCode = (code) => {
       setState((state) => ({
         ...state,
         zip_code: code,
         zipCodeErr: "",
         selectedZipCode: true,
       }));
     };

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="title-move">Please select your vehicle type.</div>
          {(() => {
            if (loading) {
              return (
                <div
                  className="col-12  alert alert-info text-center"
                  role="alert"
                  style={{ fontSize: 15 }}
                >
                  <i className="fa fa-spinner fa-spin"></i> Processing...
                </div>
              );
            }

            if (error) {
              return (
                <div
                  className="col-12  alert alert-danger text-center"
                  role="alert"
                  style={{ fontSize: 15 }}
                >
                  {message}
                </div>
              );
            }
          })()}
          <div className="col-md-12 col-sm-12 mb-5">
            <div className="row justify-content-center">
              {(() => {
                return data?.map((item, index) => (
                  <div className="col-md-3 col-sm-6 col-xs-12" key={index}>
                    <div
                      className="d-flex bd-highlight m-4 justify-content-center align-items-center"
                      style={{
                        width: "17rem",
                        height: "17rem",
                        // background: '#FFFFFF',
                        boxShadow: `.2rem .2rem .6rem .8rem ${
                          item.id === state.vehicle_type_id
                            ? "#fea629"
                            : "#cccccc"
                        }`,
                        borderRadius: ".5rem",
                      }}
                      onClick={() => handleSelectTypeClick(item.id)}
                    >
                      <div
                        className="d-flex flex-column justify-content-center align-items-center m-3"
                        style={{ fontSize: 15 }}
                      >
                        {item.image ? (
                          <img
                            src={
                              process.env.REACT_APP_API_BASE_URL + item.image
                            }
                            className="img-fluid m-1"
                            alt="..."
                            style={{
                              height: "12rem",
                              width: "12rem",
                            }}
                          />
                        ) : (
                          <i className="fa fa-car fa-5x" aria-hidden="true"></i>
                        )}
                        {item.title}
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          <div className="col-12 mt-5">
            <div className="row justify-content-center">
              <div
                className="col-8 p-5"
                style={{
                  boxShadow: `.01rem .01rem .5rem .5rem ${"#cccccc"}`,
                  borderRadius: ".5rem",
                }}
              >
                <div className="title-move mb-5">
                  please select your moving location.
                </div>
                <div
                  className="col-md-12 text-dark"
                  style={{ fontSize: "2rem" }}
                >
                  Moving From
                </div>
                <div className="common-input p-1">
                  <PlacesAutocomplete
                    value={state.from_address}
                    onChange={(from_address) =>
                      setState((state) => ({ ...state, from_address }))
                    }
                    onSelect={handleFromAdessSelect}
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading,
                    }) => (
                      <div>
                        <input
                          {...getInputProps({
                            placeholder: "From ...",
                            className: "location-search-input m-1",
                          })}
                        />
                        <div className="autocomplete-dropdown-container">
                          {loading && <div>Loading...</div>}
                          {suggestions.map((suggestion) => {
                            const className = suggestion.active
                              ? "suggestion-item--active"
                              : "suggestion-item";
                            // inline style for demonstration purpose
                            const style = suggestion.active
                              ? {
                                  backgroundColor: "#fafafa",
                                  cursor: "pointer",
                                  fontSize: 15,
                                  margin: "5px",
                                }
                              : {
                                  backgroundColor: "#ffffff",
                                  cursor: "pointer",
                                  fontSize: 15,
                                  margin: "5px",
                                };
                            return (
                              <div
                                key={suggestion.index}
                                {...getSuggestionItemProps(suggestion, {
                                  className,
                                  style,
                                })}
                              >
                                <span>{suggestion.description}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </PlacesAutocomplete>
                </div>
                <div
                  className="col-md-12 text-dark"
                  style={{ fontSize: "2rem" }}
                >
                  Moving To
                </div>
                <div className="common-input pr-1">
                  <PlacesAutocomplete
                    value={state.to_address}
                    onChange={(to_address) =>
                      setState((state) => ({ ...state, to_address }))
                    }
                    onSelect={handleToAdessSelect}
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading,
                    }) => (
                      <div>
                        <input
                          {...getInputProps({
                            placeholder: "To ...",
                            className: "location-search-input m-1",
                          })}
                        />
                        <div className="autocomplete-dropdown-container">
                          {loading && <div>Loading...</div>}
                          {suggestions.map((suggestion) => {
                            const className = suggestion.active
                              ? "suggestion-item--active"
                              : "suggestion-item";
                            // inline style for demonstration purpose
                            const style = suggestion.active
                              ? {
                                  backgroundColor: "#fafafa",
                                  cursor: "pointer",
                                  fontSize: 15,
                                  margin: "5px",
                                }
                              : {
                                  backgroundColor: "#ffffff",
                                  cursor: "pointer",
                                  fontSize: 15,
                                  margin: "5px",
                                };
                            return (
                              <div
                                key={suggestion.index}
                                {...getSuggestionItemProps(suggestion, {
                                  className,
                                  style,
                                })}
                              >
                                <span>{suggestion.description}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </PlacesAutocomplete>
                </div>
                <div
                  className="col-md-12 text-dark"
                  style={{ fontSize: "2rem" }}
                >
                  Moving Date
                </div>
                <div
                  className="common-input pr-1"
                  data-backdrop="static"
                  data-keyboard="false"
                  data-toggle="modal"
                  data-target="#date"
                >
                  <input
                    type="text"
                    placeholder="date e.g 2222-12-30"
                    value={
                      state.date ? moment(state.date).format("YYYY-MM-DD") : ""
                    }
                    onChange={(e) =>
                      setState((state) => ({ ...state, date: e.target.value }))
                    }
                  />
                </div>
                <div
                  className="col-md-12 text-dark"
                  style={{ fontSize: "2rem" }}
                >
                  Zip Code
                </div>
                <div className="common-input pr-1">
                  <input
                    type="text"
                    name="zip_code"
                    placeholder="Zip Code e.g 00000"
                    value={state.zip_code}
                    onChange={handleChangeZipCode}
                  />
                </div>
                {state.zipCodeData !== "" && state.selectedZipCode == false && (
                  <>
                    <center
                      className="col-md-12 text-dark mb-1 mt-1"
                      style={{ fontSize: "1.5rem" }}
                    >
                      Please Select ZipCode
                    </center>
                    {state?.zipCodeData?.map((data, index) => (
                      <div
                        key={index}
                        className="col-md-12 text-dark mb-1 mt-1"
                        style={{
                          fontSize: "1.5rem",
                          border: "1px solid #F1F2F7",
                          backgroundColor: "#F1F2F7",
                          borderRadius: "5px",
                        }}
                        data-code={data.code}
                        onClick={() => handleSelectZipCode(data.code)}
                      >
                        {data.code}
                      </div>
                    ))}
                  </>
                )}
                <div className="text-center">
                  {state.from_address !== "" &&
                  state.to_address !== "" &&
                  state.date !== "" &&
                  state.zip_code !== "" &&
                  state.vehicle_type_id !== "" &&
                  state?.selectedZipCode == true ? (
                    <Link
                      type="button"
                      to={{
                        pathname: "/service-providers",
                        state: { ...state },
                      }}
                      className="button-common mt-4 w-100"
                    >
                      Get Providers
                    </Link>
                  ) : (
                    <button
                      disabled
                      type="button"
                      className="button-common mt-4 w-100"
                    >
                      Get Providers
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="moving-des mt-5">
            <p className="text-center">
              By signing and clicking Get a Price, you affirm you have read and
              agree to the Handy Terms, and you agree and authorize Handy and
              its affiliates, and their networks of service professionals, to
              deliver marketing calls or texts using automated technology to the
              number you provided above regarding your project and other home
              services offers. Consent is not a condition of purchase.
            </p>
            <br />
            <br />
            <br />
            <p className="text-center">
              If you're moving to a new home or relocating your office, you're
              probably worried about how you're going to get it all done.
              Luckily, Handy is here to help. When you book moving help through
              the Handy platform, you'll save time, money and the inevitable
              stress that comes with any big move. Handy will connect you with
              local house movers who have the skill, experience, and equipment
              to make your house move go as smoothly as possible. You're
              responsible for providing your own moving van or truck, but once
              you've figured that out, Handy will help you figure out the rest.
              We will help you find professional furniture movers who can help
              with everything, from the initial packing and wrapping to heavy
              lifting and unpacking once you reach your final destination.
            </p>
            <br />
            <br />
            <br />
            <strong className="text-center">
              Note: This service is for moving help, including packing boxes,
              unpacking boxes, heavy lifting, and loading items into a vehicle.
              It is not full-service moving and there is no transportation
              provided.
            </strong>
          </div>
        </div>

        <div
          className="modal fade bd-example-modal-md"
          id="date"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-md"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Select Date
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row m-2">
                  <div className="col-12">
                    <center className="col-12">
                      <div className="row justify-content-md-center">
                        <Calendar
                          onChange={handleCalendarClick}
                          value={state?.date}
                        />
                      </div>
                    </center>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}