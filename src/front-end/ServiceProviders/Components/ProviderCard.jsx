import { memo } from "react";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import ServiceType from "../../../constants/ServiceType";
import Rating from "../../../components/Rating";
import { HOST } from "../../../constants";
import { classNames } from "../../../helper/class-name";

const ProviderCard = memo(({ list, is_loggedin, handleContinueClick }) => {
    const history = useHistory();
    const location = useLocation();

    const search = new URLSearchParams(location.search);

    const showHourlyRate = (provider) => {
        {
            if (
                provider.provider_type == "Individual" &&
                !!provider?.provider_profile?.hourly_rate
            ) {
                return (
                    <>
                        <span>${provider.provider_profile.hourly_rate}</span>
                        <span>/hr</span>
                    </>
                );
            }
        }
    };

    const showButtonText = (provider, isDisabled) => {
        if (isDisabled) return "Not Available";
        if (provider.provider_type == "Individual") return "Make a Request";
        else if (provider.provider_type == "Business") return "Get a Qoutation";
    };

    const handleDisableLoad = (provider) => {
        if (provider.provider_type == "Business") {
            return false;
        } else {
            const array = [
                provider.provider_type == "Individual",
                !!provider?.provider_profile?.hourly_rate,
                !!provider?.provider_schedules_count,
            ];
            return array.includes(false);
        }
    };

    const handleMovingContinueClick = (provider_id) => {
        const {
            state: {
                date,
                end_lat,
                end_lng,
                from_address,
                service_type,
                start_lat,
                start_lng,
                to_address,
                sub_service_id,
                vehicle_type_id,
                zip_code,
                selected,
            },
        } = location;

        let questions = null;
        for (let key in selected) {
            const seletedValue = selected[key];
            if (!Array.isArray(seletedValue)) {
                questions = questions
                    ? { ...questions, [key]: seletedValue.value }
                    : { [key]: seletedValue.value };
            } else if (Array.isArray(seletedValue)) {
                let options = seletedValue.map((option) => option.value);
                questions = questions
                    ? { ...questions, [key]: options }
                    : { [key]: options };
            }
        }

        history?.push({
            pathname: "/moving-request",
            state: {
                date,
                end_lat,
                end_lng,
                from_address,
                service_type,
                start_lat,
                start_lng,
                to_address,
                provider_id,
                sub_service_id,
                vehicle_type_id: vehicle_type_id?.value,
                zip_code,
                date: moment(date).format("YYYY-MM-DD"),
                questions,
            },
        });
        return;
    };

    const handleTargetModel = (provider) => {
        if (location?.state?.service_type == ServiceType.MOVING) return null;
        else if (provider?.provider_type == "Individual") return "#hourly";
        else if (provider?.provider_type == "Business") return "#quotation";
    };

    return (
        <>
            {list?.map((provider, index) => {
                return (
                    <div key={index} className="job-provider-card">
                        <div className="user-des d-flex align-items-center justify-content-start w-100">
                            <div className="user-img d-flex align-items-center justify-content-center">
                                <img
                                    src={
                                        (provider.image &&
                                            `${HOST}${provider.image}`) ||
                                        ""
                                    }
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                            "/assets/img/Profile_avatar.png";
                                    }}
                                    className="img-fluid"
                                    alt="Not Found"
                                />
                            </div>
                            <div className="user-detail w-100">
                                <div className=" w-100 d-flex align-items-center justify-content-between">
                                    <div className="title">
                                        {provider?.provider_type ==
                                        "Individual" ? (
                                            <>
                                                {provider.first_name}{" "}
                                                {provider.last_name}
                                            </>
                                        ) : (
                                            provider?.provider_profile
                                                ?.business_name
                                        )}
                                    </div>
                                    <Link
                                        to={`/provider/profile/${
                                            provider.id
                                        }?subService=${search.get(
                                            "subService"
                                        )}`}
                                        className="button-common"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                                <div className="job-status">
                                    {provider.provider_service_requests_count}{" "}
                                    Jobs Completed
                                </div>
                                <div className="stars-rating w-100  d-flex align-items-center justify-content-between">
                                    <Rating rating={provider?.rating} />
                                    <ContinueBtn
                                        {...{
                                            service_type:
                                                location?.state?.service_type,
                                            provider,
                                            is_loggedin,
                                            handleMovingContinueClick,
                                            handleContinueClick,
                                            handleTargetModel,
                                            showButtonText,
                                            handleDisableLoad,
                                        }}
                                    />
                                </div>
                                <div className="user-price">
                                    {showHourlyRate(provider)}
                                </div>
                            </div>
                        </div>
                        {provider.bio && (
                            <div className="useer-qust">
                                <div className="title">Bio</div>
                                <div className="des">{provider.bio}</div>
                            </div>
                        )}
                        {provider?.user_feedbacks[0] && (
                            <>
                                <hr />
                                <div className="top-reviews-list">
                                    <div className="review-title">
                                        Top Review
                                    </div>
                                    <div className="review-item d-flex align-itmes-centetr justifu-content-between">
                                        <div className="review-img">
                                            <img
                                                src={
                                                    provider?.user_feedbacks[0]
                                                        ?.user?.image
                                                        ? `${HOST}${provider?.user_feedbacks[0]?.user?.image}`
                                                        : ""
                                                }
                                                className="img-fluid"
                                                alt="Not have"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src =
                                                        "/assets/img/Profile_avatar.png";
                                                }}
                                            />
                                        </div>
                                        {provider?.user_feedbacks[0] && (
                                            <>
                                                <div className="review-detail">
                                                    {
                                                        provider
                                                            ?.user_feedbacks[0]
                                                            .comment
                                                    }
                                                </div>
                                                <div className="review-rating">
                                                    {/* ldskjflksdjflksdj */}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </>
    );
});

const ContinueBtn = ({
    is_loggedin,
    service_type,
    provider,
    handleMovingContinueClick,
    handleContinueClick,
    handleTargetModel,
    showButtonText,
    handleDisableLoad,
}) => {
    const isDisabled = handleDisableLoad(provider);
    return (
        <button
            onClick={() => {
                if (service_type == ServiceType.MOVING)
                    handleMovingContinueClick(provider.id);
                else handleContinueClick(provider);
            }}
            value={provider.id}
            type="button"
            data-backdrop="static"
            data-keyboard="false"
            className={classNames(
                "button-common-2",
                `${isDisabled ? "disabled-btn" : ""}`
            )}
            data-toggle={is_loggedin && "modal"}
            data-target={handleTargetModel(provider)}
            disabled={isDisabled}
        >
            {showButtonText(provider, isDisabled)}
        </button>
    );
};

export { ProviderCard };
