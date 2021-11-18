import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { compose } from 'redux';
import { connect } from 'react-redux';

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
                <iframe src="https://maps.trilliumtransit.com/map/feed/citybus-lafayette-in-us?hiddenRoutes=12408,10253,10254,10252,10258,10255,10241,10251,10245,10238,10242,10260,10263,10262,10243,10246,10261,10256,10244,10247,15201" style = {{ width: "55vw", height: "70vh", margin: "40px" }} />
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