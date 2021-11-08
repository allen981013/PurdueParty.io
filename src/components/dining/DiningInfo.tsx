import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {RootState, AppDispatch} from '../../store';
import { FirebaseReducer } from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Moment from 'moment';
import {
    Box, Button, CircularProgress, Grid, Card, CardActionArea,
    CardMedia, CardContent, Typography
} from '@mui/material';

interface DiningInfoState {
    isLoaded: boolean,
    error: string,
    items: any,
    date: any
}

interface DiningInfoProps {
    auth?: FirebaseReducer.AuthState;
    diningName: string;
}

class DiningInfo extends Component<DiningInfoProps, DiningInfoState> {

    constructor(props : DiningInfoProps) {
        super(props);
        this.state = {
            isLoaded: false,
            error: null,
            items: null,
            date: Moment(new Date()).format('MM-DD-YYYY')
        };
    }

    componentDidMount() {
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
        console.log(station);
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
        //console.log(meal);
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

    render() {
        const { auth } = this.props;
        const { error, isLoaded, items } = this.state;
        if (!auth.uid) return <Redirect to='/signin' />

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
                                <p style={{ margin: "0px" }}>{this.state.date}</p>
                            </Box>
                        </Box>
                    </div>  
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
                        <Box id="cropped-purdue-img" />
                        {this.state.items.Meals.map((meal: any) => this.displayMealSection(meal))}
                    </Box>         
                </div>
            )
        }
    }
}

const mapStateToProps = (state: RootState) => {
    return {
      auth: state.firebase.auth
    }
}
  
const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        
    }
}

  export default compose<React.ComponentType<DiningInfoProps>>(
    connect(mapStateToProps, mapDispatchToProps)
  )(DiningInfo)