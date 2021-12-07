import './Saved.css'
import { Component } from 'react'
import { AppDispatch, RootState } from '../../store';
import { connect } from 'react-redux';
import { Box } from '@mui/material';

interface SavedProps {
    
}
  
interface SavedStates {
}

class Saved extends Component<SavedProps, SavedStates> {
  render() {
    return (
      <Box
        display="flex"
        alignSelf="center"
        flexDirection="column"
        alignItems="center"
        pt="8px"
        width="100%"
        maxWidth="1200px"
        padding="48px 0px"
        margin="0px 32px"
      >
      </Box>
  )
  }
}

const mapStateToProps = (state: RootState) => {
    return {
      auth: state.firebase.auth,
      username: state.auth.lastCheckedUsername ? state.auth.lastCheckedUsername : "guest",
    }
}
  
const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Saved)