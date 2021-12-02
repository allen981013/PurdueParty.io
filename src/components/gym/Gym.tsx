import { Button, Box, CircularProgress, Grid, styled, Typography } from "@mui/material"
import React from "react"
import { connect } from "react-redux"
import { AppDispatch, RootState } from '../../store'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { fetchFacilityInfos } from "./GymSlice";

export interface FacilityInfo {
  name: string;
  lastParticipantCount: number;
  totalCapacity: number;
  isClosed: boolean;
}

interface GymProps {
  errorMessage?: string;
  lastUpdatedTime?: string;
  facilityInfos?: FacilityInfo[];
  fetchFacilityInfos: () => void;
}

interface GymStates {
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

// TODO: Fix my classes in forum

class Gym extends React.Component<GymProps, GymStates> {

  constructor(props: GymProps) {
    super(props)
  }

  componentDidMount() {
    this.props.fetchFacilityInfos()
  }

  getFacilityInfoCard(info: FacilityInfo) {
    let percentage = Math.round(info.lastParticipantCount / info.totalCapacity * 100)
    return (
      <Grid item xs={12} md={6}>
        <Box textAlign="left">
          <Typography variant="h6">{info.name}</Typography>
          <BorderLinearProgress variant="determinate" value={percentage} />
          {!info.isClosed &&
            <Typography variant="body2" >
              Capacity: {info.lastParticipantCount}/{info.totalCapacity}  ({percentage}%)
            </Typography>
          }
          {info.isClosed &&
            <Typography variant="body2">
              Closed Now
            </Typography>
          }
        </Box>
      </Grid>
    )
  }

  render() {
    return <Box
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        width="100%"
        pb="32px"
      >
        <h1
          style={{ fontWeight: 300, margin: "0px", alignSelf: "flex-start" }}
        >
          Gym
        </h1>
        <Typography
          variant="subtitle2"
        >
          Last updated: {this.props.lastUpdatedTime}
        </Typography>
      </Box>
      {
        this.props.facilityInfos
        && !this.props.errorMessage
        &&
        <Grid container columnSpacing={6} rowSpacing={2}>
          {this.props.facilityInfos.map(info => this.getFacilityInfoCard(info))}
        </Grid>
      }
      {this.props.facilityInfos && this.props.errorMessage &&
        <CircularProgress />
      }
    </Box>
  }

}

const mapStateToProps = ((state: RootState) => {
  return {
    lastUpdatedTime: state.gym.lastUpdatedTime,
    facilityInfos: state.gym.facilityInfos,
    errorMessage: state.gym.errorMessage,
  }
})

const mapDispatchToProps = ((dispatch: any) => {
  return {
    fetchFacilityInfos: () => dispatch(fetchFacilityInfos()),
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Gym)