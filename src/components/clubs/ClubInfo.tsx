import React from 'react'
import { connect } from 'react-redux'
import { AppDispatch, RootState } from '../../store'

interface ClubInfoProps {

}

interface ClubInfoStates {

}

class ClubInfo extends React.Component<ClubInfoProps, ClubInfoStates> {

}

const mapStateToProps = (state: RootState) => {
    return {
    }
  }
  
  const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(ClubInfo);