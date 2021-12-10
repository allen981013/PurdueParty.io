import { Button, Box, CircularProgress, Grid, styled, Typography } from "@mui/material"
import React from "react"
import { connect } from "react-redux"
import { RootState } from '../../store'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { fetchFacilityInfos } from "./GymSlice";
import { PageVisitInfo, updatePageVisitInfo } from '../tutorial/TutorialSlice';
import { toast } from 'react-toastify';
import { GYM_TUTORIAL_1, GYM_TUTORIAL_2, GYM_TUTORIAL_3} from '../tutorial/Constants'
import { Redirect } from "react-router-dom";

export interface FacilityInfo {
  name: string;
  lastParticipantCount: number;
  totalCapacity: number;
  isClosed: boolean;
}

interface GymProps {
  auth?: any;
  errorMessage?: string;
  lastUpdatedTime?: string;
  facilityInfos?: FacilityInfo[];
  pageVisitInfo?: PageVisitInfo;
  updatePageVisitInfo?: (newPageVisitInfo: PageVisitInfo) => void;
  fetchFacilityInfos?: () => void;
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

class Gym extends React.Component<GymProps, GymStates> {

  isTutorialRendered = false

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
            <Typography variant="body2">
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
    if (!this.props.auth.uid) return <Redirect to='/signin' />
    if (this.props.pageVisitInfo 
      && !this.props.pageVisitInfo.gymPage
      && !this.isTutorialRendered
    ) {
      toast.info(GYM_TUTORIAL_1)
      toast.info(GYM_TUTORIAL_2)
      toast.info(GYM_TUTORIAL_3)
      let newPageVisitInfo: PageVisitInfo = {
        ...this.props.pageVisitInfo,
        gymPage: true,
      }
      this.props.updatePageVisitInfo(newPageVisitInfo)
      this.isTutorialRendered = true
    }
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
    pageVisitInfo: state.tutorial.pageVisitInfo,
    lastUpdatedTime: state.gym.lastUpdatedTime,
    facilityInfos: state.gym.facilityInfos,
    errorMessage: state.gym.errorMessage,
    auth: state.firebase.auth,
  }
})

const mapDispatchToProps = ((dispatch: any) => {
  return {
    updatePageVisitInfo: (newPageVisitInfo: PageVisitInfo) => dispatch(updatePageVisitInfo(newPageVisitInfo)),
    fetchFacilityInfos: () => dispatch(fetchFacilityInfos()),
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Gym)
