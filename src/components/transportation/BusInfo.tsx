import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { compose } from 'redux';
import { connect } from 'react-redux';
import map from './CityBusMap.png';
import {
    Box, Button, CircularProgress, Grid, Card, CardActionArea,
    CardMedia, CardContent, Typography
  } from '@mui/material'

interface BusInfoState {

}

interface BusInfoProps {
    auth: any
}

class BusInfo extends Component<BusInfoProps, BusInfoState> {
    constructor(props: BusInfoProps) {
        super(props);
        this.state = {

        }
    }

    render() {
        if(!this.props.auth.uid) return <Redirect to='/signin' />

        return (
            <div>
                <img src={map} alt="City Bus Map" style = {{ width: "55vw", height: "70vh", margin: "15px" }}/>
                <div style ={{ display: "grid", gridGap: "4px", gridTemplateColumns: "repeat(4, 1fr)", margin: "15px"}}>
                    <Card style = {{ backgroundColor: "Gray"}}>
                        <CardActionArea href="https://gocitybus.com/route/13-silver-loop" target="_blank" >
                            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <Typography gutterBottom noWrap component="div">
                                    Bus #13 (Silver Loop)
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    <Card style = {{ backgroundColor: "DarkOrange"}}>
                        <CardActionArea href="https://gocitybus.com/route/15-tower-acres" target="_blank" >
                            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <Typography gutterBottom noWrap component="div">
                                    Bus #15 (Tower Acres)
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    <Card style = {{ backgroundColor: "LightBlue"}}>
                        <CardActionArea href="https://gocitybus.com/route/17-ross-ade" target="_blank" >
                            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <Typography gutterBottom noWrap component="div">
                                    Bus #17 (Ross Ade)
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    <Card style = {{ backgroundColor: "DarkGoldenRod"}}>
                        <CardActionArea href="https://gocitybus.com/route/28-gold-loop" target="_blank" >
                            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <Typography gutterBottom noWrap component="div">
                                    Bus #28 (Gold Loop)
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: RootState) => {
    return {
      auth: state.firebase.auth
    }
  }
  
  const mapDispatchToProps = (dispatch: AppDispatch) => {
    // Insert functions from actions folder in similar syntax
    return {
        
    }
  }
  
  export default compose<React.ComponentType<BusInfoProps>>(
    connect(mapStateToProps, mapDispatchToProps)
  )(BusInfo)