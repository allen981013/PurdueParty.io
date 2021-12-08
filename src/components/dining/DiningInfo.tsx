import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {RootState, AppDispatch} from '../../store';
import { FirebaseReducer } from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Moment from 'moment';
import { toast } from 'react-toastify';
import { deleteStaleData, submitSurveyData } from '../../store/actions/diningActions';
import { firestoreConnect } from 'react-redux-firebase';
import {
    Box, Button, CircularProgress, Grid, Card, CardActionArea,
    CardMedia, CardContent, Typography
} from '@mui/material';
import { PageVisitInfo, updatePageVisitInfo } from '../tutorial/TutorialSlice';
import { toast } from 'react-toastify';
import { DININGINFO_TUTORIAL_1, DININGINFO_TUTORIAL_2, DININGINFO_TUTORIAL_3} from '../tutorial/Constants'

interface DiningInfoState {
    isLoaded: boolean,
    error: string,
    items: any,
    date: any,
    surveyResult: any,
    diningCourt: string,
    needUpdate: boolean,
    diningStatus: string,
    lastData: string
}

interface DiningInfoProps {
    auth?: FirebaseReducer.AuthState;
    diningName: string;
    diningErr?: string;
    diningCourt?: any;
    pageVisitInfo?: PageVisitInfo;
    updatePageVisitInfo?: (newPageVisitInfo: PageVisitInfo) => void;
    deleteStaleData?: (diningCourt: string) => void;
    submitSurveyData?: (diningInfo: any) => void;
}

class DiningInfo extends Component<DiningInfoProps, DiningInfoState> {
  
    isTutorialRendered = false

    constructor(props : DiningInfoProps) {
        super(props);
        this.state = {
            isLoaded: false,
            error: null,
            items: null,
            date: Moment(new Date()).format('MM-DD-YYYY'),
            surveyResult: null,
            diningCourt: this.props.diningName,
            needUpdate: true,
            diningStatus: "",
            lastData: null
        };
    }

    componentDidMount() {
        //Delete stale data
        this.props.deleteStaleData(this.props.diningName);

        //Query the API
        const endpoint = "https://api.hfs.purdue.edu/menus/v2/locations/" + this.props.diningName + "/" + this.state.date;
        fetch(endpoint).then(res => res.json()).then((result) => {
            this.setState({
                isLoaded: true,
                items: result
            });
        },
        (err) => {
            this.setState({
                isLoaded: true,
                error: err
            });
        })
    }

    displayStationSection(station: any) {
        return (
            <div style={{ backgroundColor: "lightgray", borderRadius: "5px" }}>
                <h4 style={{ paddingBottom: "0px", marginBottom: "0px"}}>{station.Name}</h4>
                <ul style={{ display: "inline-block", textAlign: "left"}}>
                    {station.Items.map((item : any) => (
                        <>
                            <li>
                                {item.Name} 
                                {String(item.IsVegetarian) == "true" ?
                                <span> (Vegetarian) </span>
                                :
                                <div></div>
                                }
                            </li>
                        </>
                    ))}
                </ul>
            </div>
        )
    }

    displayMealSection(meal: any) {
        return (
            <div>
                <div style={{ display: "table", borderCollapse: "separate", borderSpacing: "12px" }}>
                    <div style={{ background: "var(--dull-gold)", borderRadius: "15px", height: "44px", width: "75vw",  display: "table-cell", verticalAlign: "middle"}}>
                    <h3 style={{ paddingBottom: "0px" }}>{meal.Name}</h3>
                    {meal.Status == "Open" ?
                    <p>{meal.Hours.StartTime} - {meal.Hours.EndTime}</p>
                    :
                    <p>Not Offered Today</p>
                    }
                    </div>
                </div>
                <div style ={{ display: "grid", gridGap: "1px", gridTemplateColumns: "repeat(3, 1fr)"}}>
                    {meal.Stations.map((station: any) => this.displayStationSection(station))}
                </div>
            </div>
        )
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            surveyResult: e.target.value
        })
    }

    handleSubmit = (event : any) => {
        event.preventDefault();

        if (this.state.surveyResult == null) {
            window.alert("Please select an option before submitting!")
        } else {
            toast.success("Survey Data Submitted!");
            this.props.submitSurveyData(this.state);
            this.setState({
                needUpdate: true
            })
        }
    }

    render() {
        const { auth } = this.props;
        const { error, isLoaded, items } = this.state;
        if (!auth.uid) return <Redirect to='/signin' />
        if (this.props.pageVisitInfo 
          && !this.props.pageVisitInfo.diningInfopage
          && !this.isTutorialRendered
          ) {
          toast.info(DININGINFO_TUTORIAL_1)
          toast.info(DININGINFO_TUTORIAL_2)
          toast.info(DININGINFO_TUTORIAL_3)
          let newPageVisitInfo: PageVisitInfo = {
            ...this.props.pageVisitInfo,
            diningInfopage: true,
          }
          this.props.updatePageVisitInfo(newPageVisitInfo)
          this.isTutorialRendered = true
        }
        var status = "";
        if ((this.props.diningCourt != undefined) && (this.state.needUpdate || (this.state.lastData !== JSON.stringify(this.props.diningCourt)))) {
            const surveyInfo = this.props.diningCourt;
            if (surveyInfo.length < 4) {
                status = "Not Enough Data"
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
                diningStatus: status,
                lastData: JSON.stringify(this.props.diningCourt)
            })
        }
        console.log(status);

        if (error) {
            return (
                <div>
                    Error: {error}
                </div>
            )
        } else if (!isLoaded) {
            return (
                <div>
                    Fetching Dining Data..
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
                                <h1 style={{ fontWeight: 1000, margin: "0px" }}>{this.props.diningName} Info</h1>
                            </Box>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                width="100%"
                                pb="16px"
                            >
                                <p style={{ margin: "0px" }}>Current Status: {this.state.diningStatus}</p>
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
                        <Box id="cropped-purdue-img" />
                        {this.state.items.Meals.map((meal: any) => this.displayMealSection(meal))}
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
                    <div style={{ display: "table", borderCollapse: "separate", borderSpacing: "12px" }}>
                        <div style={{ background: "var(--dull-gold)", borderRadius: "15px", height: "44px", width: "75vw",  display: "table-cell"}}>
                            <h3 style={{ paddingBottom: "0px" }}>Status Form</h3>
                        </div>
                    </div>
                    </Box>
                    <h4 style = {{ margin: "16px"}}>On a scale from 1-5, how crowded is the dining hall?</h4>
                    <form style = {{ margin: "24px"}} onSubmit={this.handleSubmit}>
                        <label className="radio-inline" style={{ marginRight: "20px" }}>
                        <input type="radio" name="optradio" value="1" onChange={this.handleChange}/>1 (Not Crowded)
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
                        <div style = {{ margin: "20px" }}>
                            <button className = "button">Submit Updates</button>
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
      diningCourt: state.firestore.ordered.diningCourtInfo,
      diningErr: state.dining.diningErr,
      pageVisitInfo: state.tutorial.pageVisitInfo,
    }
}
  
const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        deleteStaleData: (diningCourt: string) => dispatch(deleteStaleData(diningCourt)),
        submitSurveyData: (diningInfo: any) => dispatch(submitSurveyData(diningInfo)),
        updatePageVisitInfo: (newPageVisitInfo: PageVisitInfo) => dispatch(updatePageVisitInfo(newPageVisitInfo)),
    }
}

  export default compose<React.ComponentType<DiningInfoProps>>(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((props : DiningInfoProps) => {
        if (typeof props != undefined) {
          return [
            { 
              collection: 'diningCourts',
              doc: props.diningName,
              subcollections: [{ collection: "surveyData" }],
              storeAs: 'diningCourtInfo'
            }
          ]
        } else {
          return []
        }
      })
  )(DiningInfo)