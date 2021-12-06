import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store';
import { FirebaseReducer } from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Moment from 'moment';
import { deleteStaleData, submitSurveyData } from '../../store/actions/laundryActions';
import { firestoreConnect } from 'react-redux-firebase';
import {
    Box, Button, CircularProgress, Grid, Card, CardActionArea,
    CardMedia, CardContent, Typography, styled
} from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';


export interface FacilityInfo {
    name: string;
    lastParticipantCount: number;
    totalCapacity: number;
    isClosed: boolean;
}

interface LaundryInfoState {
    isLoaded: boolean,
    error: string,
    date: any,
    surveyResult: any,
    laundryLocation: string,
    needUpdate: boolean,
    status: string,
    avgScore: number,
    washers: number,
    dryers: number
}

interface LaundryInfoProps {
    auth?: FirebaseReducer.AuthState;
    laundryName: string;
    laundryErr?: string;
    laundryLocation?: any;
    laundryObject?: any;
    deleteStaleData?: (laundryLocation: string) => void;
    submitSurveyData?: (laundryInfo: any) => void;
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 12,
    borderRadius: 7,
    margin: "4px 0px 4px",
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));

class LaundryInfo extends Component<LaundryInfoProps, LaundryInfoState> {

    constructor(props: LaundryInfoProps) {
        super(props);

        var washers = 0;
        var dryers = 0;

        switch (this.props.laundryName) {
            case 'Earhart':
                washers = 16;
                dryers = 32;
                break;
            case 'Hawkins':
                washers = 32;
                dryers = 16;
                break;
            case 'Hillenbrand':
                washers = 20;
                dryers = 24;
                break;
            case 'HonorsNorth':
                washers = 12;
                dryers = 16;
                break;
            case 'HonorsSouth':
                washers = 8;
                dryers = 12;
                break;
            case 'Shreve':
                washers = 15;
                dryers = 15;
                break;
            case 'Wiley':
                washers = 12;
                dryers = 15;
                break;
            case 'Windsor':
                washers = 20;
                dryers = 30;
        }

        this.state = {
            isLoaded: false,
            error: null,
            date: Moment(new Date()).format('MM-DD-YYYY'),
            surveyResult: null,
            laundryLocation: this.props.laundryName,
            needUpdate: true,
            status: "",
            avgScore: 0,
            washers: washers,
            dryers: dryers
        };
    }

    getLaundryPercentage(laundry: any) {
        let percentage = Math.round(laundry.avgScore / 5 * 100)

        return (
            <Grid item xs={12} md={6}>
                <Box textAlign="left">
                   
                    {!(laundry.status == "Not Enough Recent Data") &&
                        <Box>
                            <BorderLinearProgress variant="determinate" value={percentage} />
                            <Typography variant="h6">Estimated Washing Machine Occupancy</Typography>
                            <Typography variant="body2" sx={{ color: "#00000099" }}>
                                Capacity: {Math.round(laundry.avgScore / 5 * laundry.washers)}/{laundry.washers}  ({percentage}%)
                            </Typography>
                            <BorderLinearProgress variant="determinate" value={percentage} />
                            <Typography variant="h6">Estimated Drying Machine Occupancy</Typography>
                            <Typography variant="body2" sx={{ color: "#00000099" }}>
                            Capacity: {Math.round(laundry.avgScore / 5 * laundry.dryers)}/{laundry.dryers}  ({percentage}%)
                            </Typography>
                        </Box>
                    }
                    {(laundry.status == "Not Enough Recent Data") &&
                        <Typography variant="body2" sx={{ color: "#00000099" }}>
                            No users have reported data on this laundry location. Please try again later.
                        </Typography>
                    }
                </Box>
            </Grid>
        )
    }


    componentDidMount() {
        //Delete stale data
        this.props.deleteStaleData(this.props.laundryName);

        this.setState({
            isLoaded: true,
        });

    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            surveyResult: e.target.value
        })
    }

    handleSubmit = (event: any) => {
        event.preventDefault();

        if (this.state.surveyResult == null) {
            window.alert("Please select an option before submitting!")
        } else {
            this.props.submitSurveyData(this.state);
            this.setState({
                needUpdate: true
            })
            window.alert("Status of laundry location submitted.")
        }
    }

    HonorsRender(title: any) {
        if (title.includes("South")) {
            return ("Honors South");
        }
        else if (title.includes("North")) {
            return ("Honors North");
        }
        else {
            return title;
        }
    }


    render() {
        /* Do authentification checks*/
        const { auth } = this.props;
        const { error, isLoaded } = this.state;
        if (!auth.uid) return <Redirect to='/signin' />

        /* Check if state / props are loaded properly */
        var status = "";

        if (this.props.laundryLocation != undefined && this.state.needUpdate) {
            const surveyInfo = this.props.laundryLocation;
            if (surveyInfo.length < 4) {
                status = "Not Enough Recent Data"
            } else {
                var avgScore = 0;
                for (let i = 0; i < surveyInfo.length; i++) {
                    avgScore += parseInt(surveyInfo[i].rating);
                }

                avgScore /= surveyInfo.length;

                if (avgScore >= 1 && avgScore <= 2) {
                    status = "Slightly Crowded";
                } else if (avgScore > 2 && avgScore < 4) {
                    status = "Moderately Crowded";
                } else {
                    status = "Very Crowded";
                }

            }

            this.setState({
                needUpdate: false,
                status: status,
                avgScore: avgScore
            })
        }
        console.log("HERE NOW")
        console.log(this.state);

        if (error) {
            return (
                <div>
                    Error: {error}
                </div>
            )
        } else if (!isLoaded) {
            return (
                <div>
                    Fetching Laundry Data..
                </div>
            )
        } else {
            return (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Box
                            display="flex"
                            alignSelf="center"
                            flexDirection="column"
                            alignItems="center"
                            pt="8px"
                            width="100%"
                            maxWidth="1200px"
                            padding="48px 16px"
                        >
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                width="100%"
                                pb="8px"
                            >
                                <h1 style={{ fontWeight: 1000, margin: "0px" }}>{this.HonorsRender(this.props.laundryName)} Laundry Info</h1>
                            </Box>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                width="100%"
                                pb="16px"
                            >
                                <p style={{ margin: "0px" }}>Current Status: {this.state.status}</p>
                            </Box>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                width="100%"
                                pb="16px"
                            >
                                <p style={{ margin: "0px" }}>{this.state.date}</p>
                            </Box>
                        </Box>
                    </div>

                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
                        <div style={{ display: "table", borderCollapse: "separate", borderSpacing: "12px" }}>
                            <div style={{ background: "var(--dull-gold)", borderRadius: "15px", height: "44px", width: "75vw", display: "table-cell" }}>
                                <h3 style={{ paddingBottom: "0px" }}>Laundry Occupancy</h3>
                            </div>
                        </div>
                    </Box>

                    <Grid container columnSpacing={6} rowSpacing={2} marginLeft={"130px"}>
                        {this.getLaundryPercentage(this.state)}
                    </Grid>


                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
                        <div style={{ display: "table", borderCollapse: "separate", borderSpacing: "12px" }}>
                            <div style={{ background: "var(--dull-gold)", borderRadius: "15px", height: "44px", width: "75vw", display: "table-cell" }}>
                                <h3 style={{ paddingBottom: "0px" }}>Status Form</h3>
                            </div>
                        </div>
                    </Box>

                    <h4 style={{ margin: "16px" }}>On a scale from 1-5, how crowded is this laundry location?</h4>
                    <form style={{ margin: "24px" }} onSubmit={this.handleSubmit}>
                        <label className="radio-inline" style={{ marginRight: "20px" }}>
                            <input type="radio" name="optradio" value="1" onChange={this.handleChange} />1 (Not Crowded)
                        </label>
                        <label className="radio-inline" style={{ marginRight: "20px" }}>
                            <input type="radio" name="optradio" value="2" onChange={this.handleChange} />2 (Slightly Crowded)
                        </label>
                        <label className="radio-inline" style={{ marginRight: "20px" }}>
                            <input type="radio" name="optradio" value="3" onChange={this.handleChange} />3 (Moderately Crowded)
                        </label>
                        <label className="radio-inline" style={{ marginRight: "20px" }}>
                            <input type="radio" name="optradio" value="4" onChange={this.handleChange} />4 (Pretty Crowded)
                        </label>
                        <label className="radio-inline" style={{ marginRight: "20px" }}>
                            <input type="radio" name="optradio" value="5" onChange={this.handleChange} />5 (Extremely Crowded)
                        </label>
                        <div style={{ margin: "20px" }}>
                            <button className="button">Submit Updates</button>
                        </div>
                    </form>
                </div>
            )
        }
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        auth: state.firebase.auth,
        laundryLocation: state.firestore.ordered.laundryInfo,
        //laundryErr: state.laundry.laundryErr
    }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        deleteStaleData: (laundryLocation: string) => dispatch(deleteStaleData(laundryLocation)),
        submitSurveyData: (laundryInfo: any) => dispatch(submitSurveyData(laundryInfo))
    }
}

export default compose<React.ComponentType<LaundryInfoProps>>(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((props: LaundryInfoProps) => {
        if (typeof props != undefined) {
            return [
                {
                    collection: 'laundry',
                    doc: props.laundryName,
                    subcollections: [{ collection: "surveyData" }],
                    storeAs: 'laundryInfo'
                }
            ]
        } else {
            return []
        }
    })
)(LaundryInfo)