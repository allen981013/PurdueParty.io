import React from "react"
import { connect } from "react-redux"
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from "redux"
import { AppDispatch, RootState } from '../../store';
import { Box } from '@mui/material'

interface ForumMainPageProps {

}

interface ForumMainPageStates {

}

class ForumMainPage extends React.Component<ForumMainPageProps, ForumMainPageStates> {

  render() {
    return (
      <Box width="1200px" pt="32px" display="flex" alignSelf="center">
        <Box width="100%" display="flex">
          <h1 style={{ fontWeight: 300, margin: "0px" }}>Forum</h1>
        </Box>
      </Box>
    )
  }

}

const mapStateToProps = (state: RootState) => {
  return {
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
  }
}

export default compose<React.ComponentType<ForumMainPageProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
  ])
)(ForumMainPage)