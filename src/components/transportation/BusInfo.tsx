import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { PageVisitInfo, updatePageVisitInfo } from '../tutorial/TutorialSlice';
import { toast } from 'react-toastify';
import { BUS_TUTORIAL_1, BUS_TUTORIAL_2, BUS_TUTORIAL_3} from '../tutorial/Constants'

interface BusInfoState {
}

interface BusInfoProps {
    auth: any
    pageVisitInfo: PageVisitInfo;
    updatePageVisitInfo: (newPageVisitInfo: PageVisitInfo) => void;
}

class BusInfo extends Component<BusInfoProps, BusInfoState> {

    isTutorialRendered = false

    constructor(props: BusInfoProps) {
        super(props);
        this.state = {
        }
    }

    render() {
      if (this.props.pageVisitInfo 
        && !this.props.pageVisitInfo.transportationPage
        && !this.isTutorialRendered
        ) {
        toast.info(BUS_TUTORIAL_1)
        toast.info(BUS_TUTORIAL_2)
        toast.info(BUS_TUTORIAL_3)
        let newPageVisitInfo: PageVisitInfo = {
          ...this.props.pageVisitInfo,
          transportationPage: true,
        }
        this.props.updatePageVisitInfo(newPageVisitInfo)
        this.isTutorialRendered = true
      }
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
      pageVisitInfo: state.tutorial.pageVisitInfo,
      auth: state.firebase.auth
    }
  }
  
  const mapDispatchToProps = (dispatch: AppDispatch) => {
    // Insert functions from actions folder in similar syntax
    return {
      updatePageVisitInfo: (newPageVisitInfo: PageVisitInfo) => dispatch(updatePageVisitInfo(newPageVisitInfo)),
    }
  }
  
  export default compose<React.ComponentType<BusInfoProps>>(
    connect(mapStateToProps, mapDispatchToProps)
  )(BusInfo)